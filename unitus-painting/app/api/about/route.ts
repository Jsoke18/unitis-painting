import { NextResponse } from 'next/server';
import { AboutContent } from '@/app/types/about';
import { neon } from '@neondatabase/serverless';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function validateAboutContent(content: unknown): Promise<AboutContent> {
  console.log('Validating content:', JSON.stringify(content, null, 2));

  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  const aboutContent = content as AboutContent;

  // Log each field we're checking
  console.log('Checking fields:', {
    hasBadge: !!aboutContent.badge?.text,
    hasHeading: !!aboutContent.heading,
    hasParagraphs: Array.isArray(aboutContent.paragraphs),
    hasBulletPoints: Array.isArray(aboutContent.bulletPoints),
    hasVideoUrl: !!aboutContent.videoUrl
  });

  if (!aboutContent.badge?.text ||
      !aboutContent.heading ||
      !Array.isArray(aboutContent.paragraphs) ||
      !Array.isArray(aboutContent.bulletPoints) ||
      !aboutContent.videoUrl) {
    throw new Error('Missing required fields');
  }

  return aboutContent;
}

async function getAboutFromDatabase(): Promise<AboutContent> {
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    WITH latest_about AS (
      SELECT * FROM about_content
      ORDER BY created_at DESC
      LIMIT 1
    ),
    about_with_content AS (
      SELECT 
        a.*,
        (
          SELECT json_agg(content ORDER BY display_order)
          FROM about_paragraphs
          WHERE about_id = a.id
        ) as paragraphs,
        (
          SELECT json_agg(content ORDER BY display_order)
          FROM about_bullet_points
          WHERE about_id = a.id
        ) as bullet_points
      FROM latest_about a
    )
    SELECT 
      json_build_object(
        'badge', json_build_object('text', badge_text),
        'heading', heading,
        'videoUrl', video_url,
        'paragraphs', paragraphs,
        'bulletPoints', bullet_points
      ) as content
    FROM about_with_content
  `;

  if (result.length === 0) {
    throw new Error('No about content found in database');
  }

  return result[0].content;
}

export async function GET() {
  try {
    console.log('Starting GET request');
    const content = await getAboutFromDatabase();

    console.log('Received content from database:', JSON.stringify(content, null, 2));

    const validatedContent = await validateAboutContent(content);

    console.log('Sending validated content:', JSON.stringify(validatedContent, null, 2));

    return new NextResponse(JSON.stringify(validatedContent), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    const validatedContent = await validateAboutContent(content);

    const sql = neon(process.env.DATABASE_URL!);

    // Insert new about content
    const aboutResult = await sql`
      INSERT INTO about_content (
        badge_text,
        heading,
        video_url
      ) VALUES (
        ${validatedContent.badge.text},
        ${validatedContent.heading},
        ${validatedContent.videoUrl}
      )
      RETURNING id
    `;

    const aboutId = aboutResult[0].id;

    // Insert paragraphs
    for (let i = 0; i < validatedContent.paragraphs.length; i++) {
      await sql`
        INSERT INTO about_paragraphs (about_id, content, display_order)
        VALUES (${aboutId}, ${validatedContent.paragraphs[i]}, ${i})
      `;
    }

    // Insert bullet points
    for (let i = 0; i < validatedContent.bulletPoints.length; i++) {
      await sql`
        INSERT INTO about_bullet_points (about_id, content, display_order)
        VALUES (${aboutId}, ${validatedContent.bulletPoints[i]}, ${i})
      `;
    }

    // Return the newly created content
    const updatedContent = await getAboutFromDatabase();

    return new NextResponse(JSON.stringify(updatedContent), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}