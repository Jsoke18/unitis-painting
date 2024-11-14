import { db } from '@/lib/db';

export async function getLandingServices() {
  const result = await db.query(`
    SELECT 
      ls.*,
      (
        SELECT json_agg(
          json_build_object(
            'icon', si.icon,
            'label', si.label,
            'title', si.title,
            'description', si.description,
            'imageSrc', si.image_src,
            'link', si.link
          ) ORDER BY si.display_order
        )
        FROM service_items si
        WHERE si.landing_services_id = ls.id
      ) as services
    FROM landing_services ls
    ORDER BY ls.created_at DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    throw new Error('No landing services content found');
  }

  return result.rows[0];
}

export async function updateLandingServices(content) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Insert landing services content
    const landingResult = await client.query(`
      INSERT INTO landing_services (
        heading,
        description
      ) VALUES ($1, $2)
      RETURNING id
    `, [
      content.heading,
      content.description
    ]);

    const landingId = landingResult.rows[0].id;

    // Insert service items
    const serviceValues = content.services.map((service, index) => ({
      landingId,
      icon: service.icon,
      label: service.label,
      title: service.title,
      description: service.description,
      imageSrc: service.imageSrc,
      link: service.link,
      order: index,
    }));

    for (const { icon, label, title, description, imageSrc, link, order } of serviceValues) {
      await client.query(`
        INSERT INTO service_items (
          landing_services_id,
          icon,
          label,
          title,
          description,
          image_src,
          link,
          display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [landingId, icon, label, title, description, imageSrc, link, order]);
    }

    await client.query('COMMIT');

    return getLandingServices();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}