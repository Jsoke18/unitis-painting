import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { HeroContent } from '@/app/types/hero';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'hero.json');

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function validateHeroContent(content: unknown): Promise<HeroContent> {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  const heroContent = content as HeroContent;
  
  if (!heroContent.location?.text ||
      !heroContent.mainHeading?.line1 ||
      !heroContent.mainHeading?.line2 ||
      !heroContent.subheading ||
      !heroContent.buttons?.primary?.text ||
      !heroContent.buttons?.primary?.link ||
      !heroContent.buttons?.secondary?.text ||
      !heroContent.buttons?.secondary?.link ||
      !heroContent.videoUrl) {
    throw new Error('Missing required fields');
  }

  return heroContent;
}

export async function GET() {
  try {
    // Read the file fresh each time
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const content = JSON.parse(fileContent);
    const validatedContent = await validateHeroContent(content);
    
    return new NextResponse(JSON.stringify(validatedContent), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const newContent = await request.json();
    const validatedContent = await validateHeroContent(newContent);
    
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(validatedContent, null, 2),
      'utf8'
    );
    
    return NextResponse.json({
      message: 'Content updated successfully',
      content: validatedContent
    });
  } catch (error) {
    console.error('PUT Error:', error);
    
    if (error instanceof Error && error.message === 'Missing required fields') {
      return NextResponse.json(
        { error: 'Invalid content structure: ' + error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    );
  }
}