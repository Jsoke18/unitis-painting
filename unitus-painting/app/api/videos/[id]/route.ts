import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const videoId = parseInt(params.id, 10);

  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
      SELECT * FROM videos
      WHERE id = ${videoId}
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    const video = {
      id: result[0].id,
      name: result[0].name,
      videoDate: result[0].videodate.toISOString().split('T')[0],
      url: result[0].url,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ video });
  } catch (error) {
    console.error('Failed to fetch video:', error);
    return NextResponse.json(
      { error: 'Failed to read video' },
      { status: 500 }
    );
  }
} 