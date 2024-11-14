// app/api/test-db/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // First, create the hero table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS hero (
        id SERIAL PRIMARY KEY,
        location JSONB,
        main_heading JSONB,
        subheading TEXT,
        buttons JSONB,
        video_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert test data
    const hero = await sql`
      INSERT INTO hero (
        location,
        main_heading,
        subheading,
        buttons,
        video_url
      ) VALUES (
        ${'{"text": "Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary"}'}::jsonb,
        ${'{"line1": "Transform Your Space", "line2": "Professional Painting Services"}'}::jsonb,
        ${'Expert residential and commercial painting solutions delivered with precision, professionalism, and attention to detail.'},
        ${'{"primary": {"text": "Explore Our Services", "link": "/services"}, "secondary": {"text": "Get Free Quote", "link": "/contact"}}'}::jsonb,
        ${'https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4'}
      ) RETURNING *;
    `;

    // Verify we can read the data back
    const verifyHero = await sql`SELECT * FROM hero WHERE id = ${hero[0].id}`;

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data: verifyHero[0]
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}