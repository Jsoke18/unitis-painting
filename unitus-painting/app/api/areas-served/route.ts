import { NextResponse } from 'next/server';
import { AreasServedContent } from '@/lib/db/areas-served';
import { getAreasServedContent, updateAreasServedContent } from '@/lib/db/areas-served';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Validation function
async function validateAreasServedContent(content: unknown): Promise<AreasServedContent> {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  const areasContent = content as AreasServedContent;

  // Validate page content
  if (!areasContent.page?.title || 
      !areasContent.page?.subtitle || 
      !areasContent.page?.metaDescription) {
    throw new Error('Missing required page content fields');
  }

  // Validate locations
  if (!Array.isArray(areasContent.locations) || areasContent.locations.length === 0) {
    throw new Error('Locations must be a non-empty array');
  }

  for (const location of areasContent.locations) {
    if (!location.title ||
        !location.description ||
        !location.mapProps?.longitude ||
        !location.mapProps?.latitude ||
        !location.mapProps?.zoom ||
        !location.contact?.phone ||
        !location.contact?.email ||
        !location.contact?.hours) {
      throw new Error('Missing required location fields');
    }
  }

  return areasContent;
}

export async function GET() {
  try {
    console.log('Starting GET request for areas served content');
    const content = await getAreasServedContent();

    return new NextResponse(JSON.stringify(content), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch areas served content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    const validatedContent = await validateAreasServedContent(content);
    
    const updatedContent = await updateAreasServedContent(validatedContent);

    return new NextResponse(JSON.stringify(updatedContent), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update areas served content' },
      { status: 500 }
    );
  }
}