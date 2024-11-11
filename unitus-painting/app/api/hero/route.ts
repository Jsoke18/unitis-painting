// app/api/hero/route.ts
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { HeroContent, defaultHeroContent } from '../../types/Hero.ts';

// Update path to use public directory
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'hero-content.json');

async function ensureDirectoryExists() {
  const dir = path.dirname(dataFilePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await ensureDirectoryExists();
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(defaultHeroContent, null, 2),
      'utf8'
    );
  }
}

export async function GET() {
  try {
    // Ensure the file exists before trying to read it
    await ensureFileExists();
    
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    // Return default content if there's an error
    return NextResponse.json(defaultHeroContent);
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
      { error: 'Failed to update hero content' },
      { status: 500 }
    );
  }
}