import { db } from '@/lib/db';

export interface WarrantySection {
  title: string;
  icon: string;
  content: string[];
}

export interface WarrantyContent {
  hero: {
    title: string;
    subtitle: string;
  };
  sections: WarrantySection[];
}

/**
 * Retrieves the most recent warranty content from the database
 */
export async function getWarrantyContent(): Promise<WarrantyContent> {
  const result = await db.query(`
    SELECT 
      w.*,
      json_agg(
        json_build_object(
          'title', s.title,
          'icon', s.icon,
          'content', s.content
        ) ORDER BY s.id
      ) as sections
    FROM warranty_content w
    LEFT JOIN warranty_sections s ON s.warranty_id = w.id
    WHERE w.id = (
      SELECT id FROM warranty_content
      ORDER BY created_at DESC
      LIMIT 1
    )
    GROUP BY w.id
  `);

  if (result.rows.length === 0) {
    throw new Error('No warranty content found');
  }

  return {
    hero: {
      title: result.rows[0].hero_title,
      subtitle: result.rows[0].hero_subtitle,
    },
    sections: result.rows[0].sections || [],
  };
}

/**
 * Updates the warranty content by creating new entries
 * in both warranty_content and warranty_sections tables
 */
export async function updateWarrantyContent(content: WarrantyContent): Promise<WarrantyContent> {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Insert new warranty content
    const warrantyResult = await client.query(`
      INSERT INTO warranty_content (
        hero_title,
        hero_subtitle
      ) VALUES ($1, $2)
      RETURNING id
    `, [
      content.hero.title,
      content.hero.subtitle
    ]);

    const warrantyId = warrantyResult.rows[0].id;

    // Insert warranty sections
    for (const section of content.sections) {
      await client.query(`
        INSERT INTO warranty_sections (
          warranty_id,
          title,
          icon,
          content
        ) VALUES ($1, $2, $3, $4)
      `, [
        warrantyId,
        section.title,
        section.icon,
        JSON.stringify(section.content)
      ]);
    }

    await client.query('COMMIT');

    // Return the newly created content
    return getWarrantyContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Partially updates the warranty content
 */
export async function patchWarrantyContent(content: Partial<WarrantyContent>): Promise<WarrantyContent> {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Get the current warranty ID
    const currentWarranty = await client.query(`
      SELECT id FROM warranty_content
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (currentWarranty.rows.length === 0) {
      throw new Error('No warranty content found to update');
    }

    const warrantyId = currentWarranty.rows[0].id;

    // Update hero content if provided
    if (content.hero) {
      await client.query(`
        UPDATE warranty_content
        SET 
          hero_title = COALESCE($1, hero_title),
          hero_subtitle = COALESCE($2, hero_subtitle),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [
        content.hero.title,
        content.hero.subtitle,
        warrantyId
      ]);
    }

    // Update sections if provided
    if (content.sections) {
      // Delete existing sections
      await client.query(`
        DELETE FROM warranty_sections
        WHERE warranty_id = $1
      `, [warrantyId]);

      // Insert new sections
      for (const section of content.sections) {
        await client.query(`
          INSERT INTO warranty_sections (
            warranty_id,
            title,
            icon,
            content
          ) VALUES ($1, $2, $3, $4)
        `, [
          warrantyId,
          section.title,
          section.icon,
          JSON.stringify(section.content)
        ]);
      }
    }

    await client.query('COMMIT');

    // Return the updated content
    return getWarrantyContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Deletes all warranty content
 */
export async function deleteWarrantyContent(): Promise<void> {
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM warranty_sections');
    await client.query('DELETE FROM warranty_content');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}