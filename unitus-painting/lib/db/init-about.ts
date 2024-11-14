import { db } from '@/lib/db';
import { AboutContent } from '@/app/types/about';

export async function getAboutContent(): Promise<AboutContent> {
  const result = await db.query(`
    SELECT 
      a.*,
      json_build_object(
        'text', a.badge_text
      ) as badge,
      (
        SELECT json_agg(
          content ORDER BY display_order
        )
        FROM about_paragraphs
        WHERE about_id = a.id
      ) as paragraphs,
      (
        SELECT json_agg(
          content ORDER BY display_order
        )
        FROM about_bullet_points
        WHERE about_id = a.id
      ) as "bulletPoints"
    FROM about_content a
    ORDER BY a.created_at DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    throw new Error('No about content found');
  }

  return result.rows[0];
}

export async function updateAboutContent(content: AboutContent): Promise<AboutContent> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Insert about content
    const aboutResult = await client.query(`
      INSERT INTO about_content (
        badge_text,
        heading,
        video_url
      ) VALUES ($1, $2, $3)
      RETURNING id
    `, [
      content.badge.text,
      content.heading,
      content.videoUrl
    ]);

    const aboutId = aboutResult.rows[0].id;

    // Insert paragraphs
    const paragraphValues = content.paragraphs.map((text, index) => ({
      aboutId,
      text,
      order: index,
    }));

    for (const { text, order } of paragraphValues) {
      await client.query(`
        INSERT INTO about_paragraphs (about_id, content, display_order)
        VALUES ($1, $2, $3)
      `, [aboutId, text, order]);
    }

    // Insert bullet points
    const bulletPointValues = content.bulletPoints.map((text, index) => ({
      aboutId,
      text,
      order: index,
    }));

    for (const { text, order } of bulletPointValues) {
      await client.query(`
        INSERT INTO about_bullet_points (about_id, content, display_order)
        VALUES ($1, $2, $3)
      `, [aboutId, text, order]);
    }

    await client.query('COMMIT');

    return getAboutContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}