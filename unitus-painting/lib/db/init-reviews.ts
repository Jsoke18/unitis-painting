import { db } from '@/lib/db';

export async function getTestimonialsAndStats() {
  const result = await db.query(`
    SELECT
      t.*,
      (
        SELECT json_build_object(
          'totalProjects', cs.total_projects,
          'yearsInBusiness', cs.years_in_business,
          'serviceAreas', cs.service_areas,
          'averageRating', cs.average_rating,
          'customerSatisfaction', cs.customer_satisfaction,
          'featuredAvatars', (
            SELECT json_agg(fa.avatar_src ORDER BY fa.display_order)
            FROM featured_avatars fa
            WHERE fa.company_stats_id = cs.id
          )
        )
        FROM company_stats cs
        ORDER BY cs.created_at DESC
        LIMIT 1
      ) as stats,
      (
        SELECT json_agg(
          json_build_object(
            'id', t2.id,
            'name', t2.name,
            'location', t2.location,
            'avatarSrc', t2.avatar_src,
            'rating', t2.rating,
            'date', t2.review_date,
            'content', t2.content
          )
        )
        FROM testimonials t2
      ) as testimonials
    FROM testimonials t
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    throw new Error('No testimonials content found');
  }

  return {
    stats: result.rows[0].stats,
    testimonials: result.rows[0].testimonials
  };
}

export async function updateTestimonialsAndStats(content) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Insert company stats
    const statsResult = await client.query(`
      INSERT INTO company_stats (
        total_projects,
        years_in_business,
        service_areas,
        average_rating,
        customer_satisfaction
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      content.stats.totalProjects,
      content.stats.yearsInBusiness,
      content.stats.serviceAreas,
      content.stats.averageRating,
      content.stats.customerSatisfaction
    ]);

    const statsId = statsResult.rows[0].id;

    // Insert featured avatars
    for (const [index, avatarSrc] of content.stats.featuredAvatars.entries()) {
      await client.query(`
        INSERT INTO featured_avatars (
          company_stats_id,
          avatar_src,
          display_order
        ) VALUES ($1, $2, $3)
      `, [statsId, avatarSrc, index]);
    }

    // Insert testimonials
    for (const testimonial of content.testimonials) {
      await client.query(`
        INSERT INTO testimonials (
          name,
          location,
          avatar_src,
          rating,
          review_date,
          content
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        testimonial.name,
        testimonial.location,
        testimonial.avatarSrc,
        testimonial.rating,
        testimonial.date,
        testimonial.content
      ]);
    }

    await client.query('COMMIT');

    return getTestimonialsAndStats();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}