import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { AboutContent, defaultAboutContent } from '@/app/types/about';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'about-content.json');

// Force dynamic route for production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function validateContent(content: any): Promise<AboutContent> {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  if (!content.badge?.text || 
      !content.heading || 
      !Array.isArray(content.paragraphs) || 
      !content.videoUrl || 
      !Array.isArray(content.bulletPoints)) {
    throw new Error('Missing required fields');
  }

  return content as AboutContent;
}

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
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    const validatedContent = await validateContent(data);
    
    return new NextResponse(JSON.stringify(validatedContent), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        content: defaultAboutContent,
        error: error instanceof Error ? error.message : 'Failed to load content'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDirectoryExists();
    const newContent = await request.json();
    const validatedContent = await validateContent(newContent);
    
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(validatedContent, null, 2),
      'utf8'
    );
    
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Content updated successfully',
        content: validatedContent
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update content'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}