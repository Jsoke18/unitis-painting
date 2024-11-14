// lib/db/hero.ts
import { db } from '@/lib/db';
import { HeroContent } from '@/app/types/hero';

export async function getHeroContent(): Promise<HeroContent> {
  const result = await db.query(`
    SELECT 
      h.*,
      json_build_object(
        'text', h.location_text
      ) as location,
      json_build_object(
        'line1', h.main_heading_line1,
        'line2', h.main_heading_line2
      ) as main_heading,
      (
        SELECT json_build_object(
          'primary', json_build_object(
            'text', pb.text,
            'link', pb.link
          ),
          'secondary', json_build_object(
            'text', sb.text,
            'link', sb.link
          )
        )
        FROM hero_buttons pb
        JOIN hero_buttons sb ON sb.hero_id = h.id AND sb.button_type = 'secondary'
        WHERE pb.hero_id = h.id AND pb.button_type = 'primary'
      ) as buttons
    FROM hero_content h
    ORDER BY h.created_at DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    throw new Error('No hero content found');
  }

  return result.rows[0];
}

export async function updateHeroContent(content: HeroContent): Promise<HeroContent> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Update hero_content table
    const heroResult = await client.query(`
      INSERT INTO hero_content (
        location_text,
        main_heading_line1,
        main_heading_line2,
        subheading,
        video_url
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      content.location.text,
      content.mainHeading.line1,
      content.mainHeading.line2,
      content.subheading,
      content.videoUrl
    ]);

    const heroId = heroResult.rows[0].id;

    // Insert primary button
    await client.query(`
      INSERT INTO hero_buttons (hero_id, button_type, text, link)
      VALUES ($1, 'primary', $2, $3)
    `, [heroId, content.buttons.primary.text, content.buttons.primary.link]);

    // Insert secondary button
    await client.query(`
      INSERT INTO hero_buttons (hero_id, button_type, text, link)
      VALUES ($1, 'secondary', $2, $3)
    `, [heroId, content.buttons.secondary.text, content.buttons.secondary.link]);

    await client.query('COMMIT');

    return getHeroContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}