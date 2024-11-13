import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'public', 'data', 'our-approach.json');

export async function GET() {
  try {
    const content = await fs.readFile(contentPath, 'utf8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    
    // Validate content structure here if needed
    
    await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}