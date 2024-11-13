import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { StatisticsContent } from '@/types/Statistics';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'statistics.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to load statistics content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const content: StatisticsContent = await request.json();
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(content, null, 2),
      'utf8'
    );
    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update statistics content' },
      { status: 500 }
    );
  }
}