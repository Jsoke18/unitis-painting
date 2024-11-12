import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { QuoteContent } from '@/app/types/quote';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'quote-content.json');

async function ensureDirectoryExists() {
  try {
    await fs.access(path.dirname(dataFilePath));
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  }
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    // If file doesn't exist, return an error instead of default content
    return NextResponse.json(
      { error: 'Failed to load quote content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDirectoryExists();
    const newContent: QuoteContent = await request.json();
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(newContent, null, 2),
      'utf8'
    );
    return NextResponse.json({
      message: 'Content updated successfully',
      content: newContent
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update quote content' },
      { status: 500 }
    );
  }
}