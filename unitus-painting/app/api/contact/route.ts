// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { ContactPageContent, getContactContent, updateContactContent } from '@/lib/db/init-contact';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Interface matching the frontend's data structure
interface EditorContent {
  pageTitle: string;
  pageDescription: string;
  openingHours: string;
  contactInfo: Array<{
    infoType: string;
    title: string;
    phoneNumber?: string;
    companyName?: string;
    poBox?: string;
    addressLine1?: string;
    addressLine2?: string;
  }>;
  formFields: Array<any>; // We'll preserve these from the existing content
}

// Validation function for the editor content
async function validateEditorContent(content: unknown): Promise<EditorContent> {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content structure');
  }

  const editorContent = content as EditorContent;

  // Validate required fields
  if (!editorContent.pageTitle || 
      !editorContent.pageDescription || 
      !editorContent.openingHours || 
      !Array.isArray(editorContent.contactInfo)) {
    throw new Error('Missing required fields');
  }

  // Validate contact info array
  for (const info of editorContent.contactInfo) {
    if (!info.infoType || !info.title) {
      throw new Error('Invalid contact info structure');
    }

    switch (info.infoType) {
      case 'phone':
        if (!info.phoneNumber) {
          throw new Error('Phone number is required for phone contact info');
        }
        break;
      case 'head_office':
      case 'calgary_office':
        if (!info.companyName || !info.addressLine1 || !info.addressLine2) {
          throw new Error(`Required fields missing for ${info.infoType}`);
        }
        break;
      default:
        throw new Error(`Invalid info type: ${info.infoType}`);
    }
  }

  return editorContent;
}

export async function GET() {
  try {
    console.log('Starting GET request for contact page');
    const content = await getContactContent();

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
      { error: 'Failed to fetch contact page content' },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
    try {
      const content = await request.json();
      
      // Log the incoming content for debugging
      console.log('Incoming content:', JSON.stringify(content, null, 2));
      
      // Ensure formFields array exists
      if (!content.formFields) {
        content.formFields = [];  // or fetch existing form fields
      }
      
      const validatedContent = await validateEditorContent(content);
      const updatedContent = await updateContactContent(validatedContent);
  
      return new NextResponse(JSON.stringify(updatedContent), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('PUT Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to update contact page content' },
        { status: 500 }
      );
    }
  }