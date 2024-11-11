// app/api/about/route.ts
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { AboutContent, defaultAboutContent } from '@/app/types/about';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'about-content.json');

async function ensureDirectoryExists() {
  try {
    await fs.access(path.dirname(dataFilePath));
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  }
}

async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await ensureDirectoryExists();
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(defaultAboutContent, null, 2),
      'utf8'
    );
  }
}

export async function GET() {
  try {
    await ensureFileExists();
    console.log('Reading file from:', dataFilePath); // Debug log
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    console.log('File content:', fileContent); // Debug log
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    // Return default content if something goes wrong
    return NextResponse.json(defaultAboutContent);
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDirectoryExists();
    const newContent = await request.json();
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
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}