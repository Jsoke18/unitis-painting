import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

interface Video {
  id: number;
  name: string;
  videoDate: string;
  url: string;
  createdAt: string;
  updatedAt?: string;
}

// Force dynamic route like in hero API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
      SELECT * FROM videos
      ORDER BY videodate DESC
    `;
    
    const videos = result.map(row => ({
      id: row.id,
      name: row.name,
      videoDate: row.videodate.toISOString().split('T')[0],
      url: row.url,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json(
      { error: 'Failed to read videos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, videoDate, url } = await req.json();
    
    const result = await sql`
      INSERT INTO videos (name, videodate, url)
      VALUES (${name}, ${videoDate}::DATE, ${url})
      RETURNING *
    `;

    return NextResponse.json({ success: true, video: result[0] });
  } catch (error) {
    console.error('Failed to create video:', error);
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, name, videoDate, url } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE videos 
      SET 
        name = ${name}, 
        videodate = ${videoDate}::DATE, 
        url = ${url}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      video: result[0]
    });
  } catch (error) {
    console.error('Failed to update video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }
    
    const result = await sql`
      DELETE FROM videos 
      WHERE id = ${parseInt(id, 10)}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
} 