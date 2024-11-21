import { db } from '@/lib/db';

// Types
export interface PageContent {
  title: string;
  subtitle: string;
  metaDescription: string;
}

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

export interface Location {
  title: string;
  description: string;
  address?: Address;
  mapProps: MapProps;
  contact: Contact;
}

export interface AreasServedContent {
  page: PageContent;
  locations: Location[];
}

export async function getAreasServedContent(): Promise<AreasServedContent> {
  const client = await db.connect();
  
  try {
    // Get page content
    const pageResult = await client.query(`
      SELECT title, subtitle, meta_description
      FROM page_content
      ORDER BY created_at DESC
      LIMIT 1
    `);

    // Get locations with all related data using the get_areas_served function
    const locationsResult = await client.query(`
      SELECT * FROM get_areas_served()
    `);

    // Transform the database results into the expected format
    const page: PageContent = {
      title: pageResult.rows[0].title,
      subtitle: pageResult.rows[0].subtitle,
      metaDescription: pageResult.rows[0].meta_description
    };

    const locations: Location[] = locationsResult.rows.map(row => ({
      title: row.title,
      description: row.description,
      ...(row.address_title && {
        address: {
          title: row.address_title,
          lines: row.address_lines
        }
      }),
      mapProps: {
        longitude: Number(row.longitude),
        latitude: Number(row.latitude),
        zoom: row.zoom
      },
      contact: {
        phone: row.phone,
        email: row.email,
        hours: row.hours
      }
    }));

    return { page, locations };
  } finally {
    client.release();
  }
}

export async function updateAreasServedContent(content: AreasServedContent): Promise<AreasServedContent> {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Update page content
    await client.query(`
      INSERT INTO page_content (title, subtitle, meta_description)
      VALUES ($1, $2, $3)
    `, [content.page.title, content.page.subtitle, content.page.metaDescription]);

    // Delete existing data to avoid duplicates
    await client.query(`
      DELETE FROM areas_served CASCADE
    `);

    // Insert each location
    for (const location of content.locations) {
      // Insert main location data
      const areaResult = await client.query(`
        INSERT INTO areas_served (title, description)
        VALUES ($1, $2)
        RETURNING id
      `, [location.title, location.description]);

      const areaId = areaResult.rows[0].id;

      // Insert address if provided
      if (location.address) {
        await client.query(`
          INSERT INTO location_addresses (area_id, title, address_lines)
          VALUES ($1, $2, $3)
        `, [areaId, location.address.title, location.address.lines]);
      }

      // Insert map coordinates
      await client.query(`
        INSERT INTO map_coordinates (area_id, longitude, latitude, zoom)
        VALUES ($1, $2, $3, $4)
      `, [areaId, location.mapProps.longitude, location.mapProps.latitude, location.mapProps.zoom]);

      // Insert contact information
      await client.query(`
        INSERT INTO contact_information (area_id, phone, email, hours)
        VALUES ($1, $2, $3, $4)
      `, [areaId, location.contact.phone, location.contact.email, location.contact.hours]);
    }

    await client.query('COMMIT');
    
    // Return the newly updated content
    return getAreasServedContent();
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}