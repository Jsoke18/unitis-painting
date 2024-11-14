import { NextResponse } from 'next/server';
import { HeroContent } from '@/app/types/hero';
import { neon } from '@neondatabase/serverless';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Validation function
async function validateHeroContent(content: unknown): Promise<HeroContent> {
  console.log('Validating content:', JSON.stringify(content, null, 2));

  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  const heroContent = content as HeroContent;

  // Log each field we're checking
  console.log('Checking fields:', {
    hasLocation: !!heroContent.location?.text,
    hasMainHeading1: !!heroContent.mainHeading?.line1,
    hasMainHeading2: !!heroContent.mainHeading?.line2,
    hasSubheading: !!heroContent.subheading,
    hasPrimaryButton: !!heroContent.buttons?.primary?.text && !!heroContent.buttons?.primary?.link,
    hasSecondaryButton: !!heroContent.buttons?.secondary?.text && !!heroContent.buttons?.secondary?.link,
    hasVideoUrl: !!heroContent.videoUrl
  });

  if (!heroContent.location?.text ||
    !heroContent.mainHeading?.line1 ||
    !heroContent.mainHeading?.line2 ||
    !heroContent.subheading ||
    !heroContent.buttons?.primary?.text ||
    !heroContent.buttons?.primary?.link ||
    !heroContent.buttons?.secondary?.text ||
    !heroContent.buttons?.secondary?.link ||
    !heroContent.videoUrl) {
    throw new Error('Missing required fields');
  }

  return heroContent;
}

async function getHeroFromDatabase(): Promise<HeroContent> {
  const sql = neon(process.env.DATABASE_URL!);

  // Get the most recent hero content with its buttons
  const result = await sql`
    WITH latest_hero AS (
      SELECT * FROM hero_content
      ORDER BY created_at DESC
      LIMIT 1
    ),
    hero_with_buttons AS (
      SELECT 
        h.*,
        json_build_object(
          'primary', (
            SELECT json_build_object('text', text, 'link', link)
            FROM hero_buttons
            WHERE hero_id = h.id AND button_type = 'primary'
          ),
          'secondary', (
            SELECT json_build_object('text', text, 'link', link)
            FROM hero_buttons
            WHERE hero_id = h.id AND button_type = 'secondary'
          )
        ) as buttons
      FROM latest_hero h
    )
    SELECT 
      json_build_object(
        'location', json_build_object('text', location_text),
        'mainHeading', json_build_object(
          'line1', main_heading_line1,
          'line2', main_heading_line2
        ),
        'subheading', subheading,
        'videoUrl', video_url,
        'buttons', buttons
      ) as content
    FROM hero_with_buttons
  `;

  if (result.length === 0) {
    throw new Error('No hero content found in database');
  }

  return result[0].content;
}

export async function GET() {
  try {
    console.log('Starting GET request');
    const content = await getHeroFromDatabase();

    console.log('Received content from database:', JSON.stringify(content, null, 2));

    const validatedContent = await validateHeroContent(content);

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
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    const validatedContent = await validateHeroContent(content);

    const sql = neon(process.env.DATABASE_URL!);

    // Insert new hero content
    const heroResult = await sql`
      INSERT INTO hero_content (
        location_text,
        main_heading_line1,
        main_heading_line2,
        subheading,
        video_url
      ) VALUES (
        ${validatedContent.location.text},
        ${validatedContent.mainHeading.line1},
        ${validatedContent.mainHeading.line2},
        ${validatedContent.subheading},
        ${validatedContent.videoUrl}
      )
      RETURNING id
    `;

    const heroId = heroResult[0].id;

    // Insert buttons
    await sql`
      INSERT INTO hero_buttons (hero_id, button_type, text, link)
      VALUES 
        (${heroId}, 'primary', ${validatedContent.buttons.primary.text}, ${validatedContent.buttons.primary.link}),
        (${heroId}, 'secondary', ${validatedContent.buttons.secondary.text}, ${validatedContent.buttons.secondary.link})
    `;

    // Return the newly created content
    const updatedContent = await getHeroFromDatabase();

    return new NextResponse(JSON.stringify(updatedContent), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    );
  }
}