import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);

// Type definitions
interface WarrantyContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  sections: WarrantySection[];
}

interface WarrantySection {
  id: number;
  title: string;
  icon: string;
  content: string[];
}

// Updated validation schemas to match frontend data structure
const warrantyContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

const warrantySectionSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  content: z.array(z.string().min(1)).or(z.string().min(1)),
});

const updateWarrantySchema = z.object({
  hero: warrantyContentSchema,
  sections: z.array(warrantySectionSchema),
});

/**
 * Database operations
 */
async function getLatestWarrantyContent() {
  const warrantyContent = await sql<WarrantyContent[]>`
    SELECT id, hero_title, hero_subtitle
    FROM warranty_content
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!warrantyContent.length) {
    throw new Error('No warranty content found');
  }

  const sections = await sql<WarrantySection[]>`
    SELECT id, title, icon, content
    FROM warranty_sections
    WHERE warranty_id = ${warrantyContent[0].id}
    ORDER BY id ASC
  `;

  return {
    hero: {
      title: warrantyContent[0].hero_title,
      subtitle: warrantyContent[0].hero_subtitle,
    },
    sections: sections.map(section => ({
      title: section.title,
      icon: section.icon,
      content: section.content,
    })),
  };
}

async function createWarrantyContent(data: z.infer<typeof updateWarrantySchema>) {
  // Transform the data to match database schema
  return await sql.transaction((tx) => [
    tx`
      INSERT INTO warranty_content (
        hero_title,
        hero_subtitle
      ) VALUES (
        ${data.hero.title},
        ${data.hero.subtitle}
      )
      RETURNING id
    `,
    ...data.sections.map(section => {
      // Handle both string and array content
      const content = typeof section.content === 'string'
        ? section.content
            .split('\n\n')
            .map(text => text.trim())
            .filter(Boolean)
        : section.content;

      return tx`
        INSERT INTO warranty_sections (
          warranty_id,
          title,
          icon,
          content
        ) VALUES (
          (SELECT id FROM warranty_content ORDER BY created_at DESC LIMIT 1),
          ${section.title},
          ${section.icon},
          ${JSON.stringify(content)}
        )
      `;
    })
  ]);
}

async function updateExistingWarrantyContent(
  warrantyId: number,
  data: Partial<z.infer<typeof updateWarrantySchema>>
) {
  const queries = [];

  if (data.hero) {
    queries.push(sql`
      UPDATE warranty_content
      SET 
        hero_title = COALESCE(${data.hero.title}, hero_title),
        hero_subtitle = COALESCE(${data.hero.subtitle}, hero_subtitle),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${warrantyId}
    `);
  }

  if (data.sections) {
    queries.push(
      sql`DELETE FROM warranty_sections WHERE warranty_id = ${warrantyId}`,
      ...data.sections.map(section => {
        const content = typeof section.content === 'string'
          ? section.content
              .split('\n\n')
              .map(text => text.trim())
              .filter(Boolean)
          : section.content;

        return sql`
          INSERT INTO warranty_sections (
            warranty_id,
            title,
            icon,
            content
          ) VALUES (
            ${warrantyId},
            ${section.title},
            ${section.icon},
            ${JSON.stringify(content)}
          )
        `;
      })
    );
  }

  return await sql.transaction((tx) => 
    queries.map(query => tx(query.statement, ...query.values))
  );
}

/**
 * Route Handlers
 */
export async function GET() {
  try {
    const content = await getLatestWarrantyContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching warranty content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warranty content' },
      { status: error instanceof Error && error.message === 'No warranty content found' ? 404 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = updateWarrantySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const result = await createWarrantyContent(validationResult.data);
    const warrantyId = result[0][0].id;

    return NextResponse.json({
      success: true,
      message: 'Warranty content updated successfully',
      warrantyId,
    });
  } catch (error) {
    console.error('Error updating warranty content:', error);
    return NextResponse.json(
      { error: 'Failed to update warranty content' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    
    const validationResult = updateWarrantySchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const currentWarranty = await sql`
      SELECT id FROM warranty_content
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!currentWarranty.length) {
      return NextResponse.json(
        { error: 'No warranty content found to update' },
        { status: 404 }
      );
    }

    await updateExistingWarrantyContent(currentWarranty[0].id, validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Warranty content updated successfully',
    });
  } catch (error) {
    console.error('Error updating warranty content:', error);
    return NextResponse.json(
      { error: 'Failed to update warranty content' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await sql.transaction((tx) => [
      tx`DELETE FROM warranty_sections`,
      tx`DELETE FROM warranty_content`
    ]);

    return NextResponse.json({
      success: true,
      message: 'Warranty content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting warranty content:', error);
    return NextResponse.json(
      { error: 'Failed to delete warranty content' },
      { status: 500 }
    );
  }
}