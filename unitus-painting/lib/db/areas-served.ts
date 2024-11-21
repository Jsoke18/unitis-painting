import { db } from '@/lib/db';

// Types
export interface Address {
  title: string;
  lines: string[];
}

export interface MapProps {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface Contact {
  phone: string;
  email: string;
  hours: string;
}

export interface PageContent {
  title: string;
  subtitle: string;
  metaDescription?: string;
}

export interface AreaServed {
  id: number;
  title: string;
  description: string;
  address?: Address;
  mapProps: MapProps;
  contact: Contact;
}

export async function getPageContent(): Promise<PageContent> {
  const result = await db.query(`
    SELECT 
      title,
      subtitle,
      meta_description as "metaDescription"
    FROM page_content
    ORDER BY created_at DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    throw new Error('No page content found');
  }

  return result.rows[0];
}

export async function getAreasServed(): Promise<AreaServed[]> {
  const result = await db.query(`
    SELECT 
      a.id,
      a.title,
      a.description,
      CASE 
        WHEN addr.title IS NOT NULL THEN
          json_build_object(
            'title', addr.title,
            'lines', addr.address_lines
          )
        ELSE NULL
      END as address,
      json_build_object(
        'longitude', mc.longitude,
        'latitude', mc.latitude,
        'zoom', mc.zoom
      ) as "mapProps",
      json_build_object(
        'phone', ci.phone,
        'email', ci.email,
        'hours', ci.hours
      ) as contact
    FROM areas_served a
    LEFT JOIN location_addresses addr ON addr.area_id = a.id
    JOIN map_coordinates mc ON mc.area_id = a.id
    JOIN contact_information ci ON ci.area_id = a.id
    ORDER BY a.created_at DESC
  `);

  return result.rows;
}

export async function updateAreaServed(area: Omit<AreaServed, 'id'>): Promise<AreaServed> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert main area content
    const areaResult = await client.query(`
      INSERT INTO areas_served (title, description)
      VALUES ($1, $2)
      RETURNING id
    `, [area.title, area.description]);
    
    const areaId = areaResult.rows[0].id;
    
    // Insert address if provided
    if (area.address) {
      await client.query(`
        INSERT INTO location_addresses (area_id, title, address_lines)
        VALUES ($1, $2, $3)
      `, [areaId, area.address.title, area.address.lines]);
    }
    
    // Insert map coordinates
    await client.query(`
      INSERT INTO map_coordinates (area_id, longitude, latitude, zoom)
      VALUES ($1, $2, $3, $4)
    `, [areaId, area.mapProps.longitude, area.mapProps.latitude, area.mapProps.zoom]);
    
    // Insert contact information
    await client.query(`
      INSERT INTO contact_information (area_id, phone, email, hours)
      VALUES ($1, $2, $3, $4)
    `, [areaId, area.contact.phone, area.contact.email, area.contact.hours]);
    
    await client.query('COMMIT');
    
    // Fetch and return the newly created area
    const result = await client.query(`
      SELECT 
        a.id,
        a.title,
        a.description,
        CASE 
          WHEN addr.title IS NOT NULL THEN
            json_build_object(
              'title', addr.title,
              'lines', addr.address_lines
            )
          ELSE NULL
        END as address,
        json_build_object(
          'longitude', mc.longitude,
          'latitude', mc.latitude,
          'zoom', mc.zoom
        ) as "mapProps",
        json_build_object(
          'phone', ci.phone,
          'email', ci.email,
          'hours', ci.hours
        ) as contact
      FROM areas_served a
      LEFT JOIN location_addresses addr ON addr.area_id = a.id
      JOIN map_coordinates mc ON mc.area_id = a.id
      JOIN contact_information ci ON ci.area_id = a.id
      WHERE a.id = $1
    `, [areaId]);

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updatePageContent(content: PageContent): Promise<PageContent> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const result = await client.query(`
      INSERT INTO page_content (title, subtitle, meta_description)
      VALUES ($1, $2, $3)
      RETURNING 
        title,
        subtitle,
        meta_description as "metaDescription"
    `, [content.title, content.subtitle, content.metaDescription]);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAreaServed(id: number): Promise<void> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM areas_served WHERE id = $1', [id]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}