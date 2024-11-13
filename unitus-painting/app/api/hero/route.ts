import { NextResponse } from 'next/server';
import { HeroContent } from '@/app/types/hero';
import { getHeroFromEdgeConfig } from '@/lib/edge-config';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Validation function
async function validateHeroContent(content: unknown): Promise<HeroContent> {
  console.log('Validating content:', JSON.stringify(content, null, 2));
  
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  // Update to handle the nested 'hero' structure
  const heroContent = (content as { hero: HeroContent }).hero;
  
  if (!heroContent) {
    throw new Error('Missing hero content object');
  }
  
  // Log each field we're checking
  console.log('Checking fields:', {
    hasLocation: !!heroContent.location?.text,
    hasMainHeading1: !!heroContent.mainHeading?.line1,
    hasMainHeading2: !!heroContent.mainHeading?.line2,
    hasSubheading: !!heroContent.subheading,
    hasPrimaryButton: !!heroContent.buttons?.primary?.text && !!heroContent.buttons?.primary?.link,
    hasSecondaryButton: !!heroContent.buttons?.secondary?.text && !!heroContent.buttons?.secondary?.link,
    hasVideoUrl: !!heroContent.videoUrl
  });
  
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
    console.log('Starting GET request');
    const content = await getHeroFromEdgeConfig();
    
    console.log('Received content from Edge Config:', JSON.stringify(content, null, 2));
    
    if (!content) {
      console.log('No content found');
      return NextResponse.json(
        { error: 'Hero content not found' },
        { status: 404 }
      );
    }

    const validatedContent = await validateHeroContent({ hero: content });
    
    console.log('Sending validated content:', JSON.stringify(validatedContent, null, 2));
    
    return new NextResponse(JSON.stringify(validatedContent), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return NextResponse.json(
    { error: 'Updates must be made through the Edge Config update script' },
    { status: 405 }
  );
}