import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

const content = {
  page: {
    title: "Areas We Serve",
    subtitle: "Professional painting services across Western Canada",
    metaDescription: "Unitus Painting provides professional painting services in British Columbia, Okanagan, and Alberta regions."
  },
  locations: [
    {
      title: "British Columbia",
      description: "Serving the Greater Vancouver Area and Fraser Valley",
      address: {
        title: "Unitus Painting Ltd. (Head office)",
        lines: [
          "PO Box 21126",
          "Maple Ridge Square RPO",
          "Maple Ridge, BC V2X 1P7"
        ]
      },
      mapProps: {
        longitude: -122.5976,
        latitude: 49.2194,
        zoom: 9
      },
      contact: {
        phone: "1-833-300-6888",
        email: "info@unituspainting.com",
        hours: "8:00 am - 5:00 pm"
      }
    },
    {
      title: "Okanagan",
      description: "Serving Kamloops, Vernon, and Kelowna areas",
      mapProps: {
        longitude: -119.4960,
        latitude: 49.8880,
        zoom: 8
      },
      contact: {
        phone: "1-833-300-6888",
        email: "info@unituspainting.com",
        hours: "8:00 am - 5:00 pm"
      }
    },
    {
      title: "Alberta",
      description: "Serving Calgary and surrounding areas",
      address: {
        title: "Unitus Painting Ltd. (Calgary)",
        lines: [
          "PO Box 81041",
          "RPO Lake Bonavista",
          "Calgary, AB T2J 7C9"
        ]
      },
      mapProps: {
        longitude: -114.0719,
        latitude: 51.0447,
        zoom: 9
      },
      contact: {
        phone: "1-833-300-6888",
        email: "info@unituspainting.com",
        hours: "8:00 am - 5:00 pm"
      }
    }
  ]
};

async function dropTables() {
  console.log('Dropping existing tables...');
  
  // Drop function first
  await sql`DROP FUNCTION IF EXISTS get_areas_served CASCADE`;
  
  // Drop tables in reverse order of dependencies
  await sql`DROP TABLE IF EXISTS contact_information CASCADE`;
  await sql`DROP TABLE IF EXISTS map_coordinates CASCADE`;
  await sql`DROP TABLE IF EXISTS location_addresses CASCADE`;
  await sql`DROP TABLE IF EXISTS areas_served CASCADE`;
  await sql`DROP TABLE IF EXISTS page_content CASCADE`;
  
  console.log('Tables dropped successfully');
}

async function createTables() {
  console.log('Creating tables...');
  
  // Create page_content table
  await sql`
    CREATE TABLE page_content (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT NOT NULL,
      meta_description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create areas_served table
  await sql`
    CREATE TABLE areas_served (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create location_addresses table
  await sql`
    CREATE TABLE location_addresses (
      id SERIAL PRIMARY KEY,
      area_id INTEGER REFERENCES areas_served(id) ON DELETE CASCADE,
      title VARCHAR(255),
      address_lines TEXT[] NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create map_coordinates table
  await sql`
    CREATE TABLE map_coordinates (
      id SERIAL PRIMARY KEY,
      area_id INTEGER REFERENCES areas_served(id) ON DELETE CASCADE,
      longitude DECIMAL(9,6) NOT NULL,
      latitude DECIMAL(9,6) NOT NULL,
      zoom INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create contact_information table
  await sql`
    CREATE TABLE contact_information (
      id SERIAL PRIMARY KEY,
      area_id INTEGER REFERENCES areas_served(id) ON DELETE CASCADE,
      phone VARCHAR(20),
      email VARCHAR(255),
      hours VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create the get_areas_served function
  await sql`
    CREATE OR REPLACE FUNCTION get_areas_served()
    RETURNS TABLE (
      id INTEGER,
      title VARCHAR(255),
      description TEXT,
      address_title VARCHAR(255),
      address_lines TEXT[],
      longitude DECIMAL(9,6),
      latitude DECIMAL(9,6),
      zoom INTEGER,
      phone VARCHAR(20),
      email VARCHAR(255),
      hours VARCHAR(255)
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        a.id,
        a.title,
        a.description,
        addr.title as address_title,
        addr.address_lines,
        mc.longitude,
        mc.latitude,
        mc.zoom,
        ci.phone,
        ci.email,
        ci.hours
      FROM areas_served a
      LEFT JOIN location_addresses addr ON addr.area_id = a.id
      JOIN map_coordinates mc ON mc.area_id = a.id
      JOIN contact_information ci ON ci.area_id = a.id;
    END;
    $$ LANGUAGE plpgsql;
  `;

  console.log('Tables created successfully');
}

async function insertPageContent() {
  console.log('Inserting page content...');
  await sql`
    INSERT INTO page_content (title, subtitle, meta_description)
    VALUES (${content.page.title}, ${content.page.subtitle}, ${content.page.metaDescription})
  `;
}

async function insertLocation(location: typeof content.locations[0]) {
  // Insert main area content
  const areaResult = await sql`
    INSERT INTO areas_served (title, description)
    VALUES (${location.title}, ${location.description})
    RETURNING id
  `;

  const areaId = areaResult[0].id;

  // Insert address if provided
  if (location.address) {
    await sql`
      INSERT INTO location_addresses (area_id, title, address_lines)
      VALUES (${areaId}, ${location.address.title}, ${location.address.lines})
    `;
  }

  // Insert map coordinates
  await sql`
    INSERT INTO map_coordinates (area_id, longitude, latitude, zoom)
    VALUES (
      ${areaId}, 
      ${location.mapProps.longitude}, 
      ${location.mapProps.latitude}, 
      ${location.mapProps.zoom}
    )
  `;

  // Insert contact information
  await sql`
    INSERT INTO contact_information (area_id, phone, email, hours)
    VALUES (
      ${areaId}, 
      ${location.contact.phone}, 
      ${location.contact.email}, 
      ${location.contact.hours}
    )
  `;

  return areaId;
}

async function main() {
  try {
    console.log('Starting initialization...');

    // Drop existing tables
    await dropTables();

    // Create tables
    await createTables();

    // Insert page content
    await insertPageContent();

    // Insert all locations
    console.log('Inserting locations...');
    for (const location of content.locations) {
      const areaId = await insertLocation(location);
      console.log(`Location "${location.title}" inserted with ID:`, areaId);
    }

    console.log('Successfully initialized areas served content');
  } catch (error) {
    console.error('Failed to initialize areas served content:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('Initialization completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Initialization failed:', error);
    process.exit(1);
  });