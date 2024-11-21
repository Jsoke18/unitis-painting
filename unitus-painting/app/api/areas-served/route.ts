// app/api/areas-served/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for validation
const AddressSchema = z.object({
  title: z.string(),
  lines: z.array(z.string())
}).optional();

const MapPropsSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  zoom: z.number()
});

const ContactSchema = z.object({
  phone: z.string(),
  email: z.string().email(),
  hours: z.string()
});

const AreaServedSchema = z.object({
  title: z.string(),
  description: z.string(),
  address: AddressSchema,
  mapProps: MapPropsSchema,
  contact: ContactSchema
});

export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        as_main.id,
        as_main.title,
        as_main.description,
        CASE 
          WHEN addr.id IS NOT NULL THEN
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
        ) as map_props,
        json_build_object(
          'phone', ci.phone,
          'email', ci.email,
          'hours', ci.hours
        ) as contact
      FROM areas_served as_main
      LEFT JOIN location_addresses addr ON addr.area_id = as_main.id
      LEFT JOIN map_coordinates mc ON mc.area_id = as_main.id
      LEFT JOIN contact_information ci ON ci.area_id = as_main.id
      ORDER BY as_main.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch areas served:', error);
    return NextResponse.json(
      { error: 'Failed to fetch areas served' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');
  
  // Check API key (you'll need to set up your own API key validation)
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = AreaServedSchema.parse(body);
    
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert main area content
      const areaResult = await client.query(`
        INSERT INTO areas_served (title, description)
        VALUES ($1, $2)
        RETURNING id
      `, [validatedData.title, validatedData.description]);
      
      const areaId = areaResult.rows[0].id;
      
      // Insert address if provided
      if (validatedData.address) {
        await client.query(`
          INSERT INTO location_addresses (area_id, title, address_lines)
          VALUES ($1, $2, $3)
        `, [areaId, validatedData.address.title, validatedData.address.lines]);
      }
      
      // Insert map coordinates
      await client.query(`
        INSERT INTO map_coordinates (area_id, longitude, latitude, zoom)
        VALUES ($1, $2, $3, $4)
      `, [
        areaId,
        validatedData.mapProps.longitude,
        validatedData.mapProps.latitude,
        validatedData.mapProps.zoom
      ]);
      
      // Insert contact information
      await client.query(`
        INSERT INTO contact_information (area_id, phone, email, hours)
        VALUES ($1, $2, $3, $4)
      `, [
        areaId,
        validatedData.contact.phone,
        validatedData.contact.email,
        validatedData.contact.hours
      ]);
      
      await client.query('COMMIT');
      
      // Fetch and return the newly created area
      const result = await client.query(`
        SELECT 
          as_main.id,
          as_main.title,
          as_main.description,
          CASE 
            WHEN addr.id IS NOT NULL THEN
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
          ) as map_props,
          json_build_object(
            'phone', ci.phone,
            'email', ci.email,
            'hours', ci.hours
          ) as contact
        FROM areas_served as_main
        LEFT JOIN location_addresses addr ON addr.area_id = as_main.id
        LEFT JOIN map_coordinates mc ON mc.area_id = as_main.id
        LEFT JOIN contact_information ci ON ci.area_id = as_main.id
        WHERE as_main.id = $1
      `, [areaId]);
      
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to create area served:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create area served' },
      { status: 500 }
    );
  }
}