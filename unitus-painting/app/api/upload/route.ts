import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';

// Function to initialize Google Cloud Storage client
function initializeStorage() {
  if (!process.env.GOOGLE_CREDENTIALS_BASE64 || !process.env.GOOGLE_PROJECT_ID) {
    throw new Error('Missing Google Cloud credentials or project ID');
  }

  // Decode the base64 credentials
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
  );

  return new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials
  });
}

// Initialize storage client
const storage = initializeStorage();
const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME || 'unitis-videos');

// Function to generate a unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const hash = crypto.randomBytes(8).toString('hex');
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  return `blog-images/${timestamp}-${hash}${ext}`;
}

export async function POST(request: Request) {
  try {
    // Add debug logging
    console.log('Starting upload process...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Log file details
    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only JPG, PNG, WebP, and GIF files are allowed' },
        { status: 400 }
      );
    }

    // Log environment variables (without sensitive data)
    console.log('Environment check:', {
      hasProjectId: !!process.env.GOOGLE_PROJECT_ID,
      hasBucketName: !!process.env.GOOGLE_BUCKET_NAME,
      hasCredentials: !!process.env.GOOGLE_CREDENTIALS_BASE64,
      projectId: process.env.GOOGLE_PROJECT_ID,
      bucketName: process.env.GOOGLE_BUCKET_NAME
    });

    // Initialize storage with debug
    try {
      if (!process.env.GOOGLE_CREDENTIALS_BASE64 || !process.env.GOOGLE_PROJECT_ID) {
        throw new Error('Missing Google Cloud credentials or project ID');
      }

      // Decode and parse credentials
      const credentials = JSON.parse(
        Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
      );

      console.log('Credentials parsed successfully');

      const storage = new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials
      });

      console.log('Storage client initialized');

      const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME || 'unitis-videos');
      
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const hash = crypto.randomBytes(8).toString('hex');
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      const filename = `blog-images/${timestamp}-${hash}${ext}`;

      console.log('Uploading file:', filename);

      // Create a new blob in the bucket
      const blob = bucket.file(filename);

      // Upload file with detailed error handling
      try {
        await blob.save(buffer, {
          metadata: {
            contentType: file.type,
          },
          resumable: false
        });

        console.log('File uploaded successfully');

        // Construct the public URL
        const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_BUCKET_NAME || 'unitis-videos'}/${filename}`;

        return NextResponse.json({
          success: true,
          url: publicUrl
        });
      } catch (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }
    } catch (storageError) {
      console.error('Storage initialization error:', storageError);
      throw storageError;
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [files] = await bucket.getFiles({
      prefix: 'blog-images/',
    });

    const fileUrls = files.map(file => 
      `https://storage.googleapis.com/${process.env.GOOGLE_BUCKET_NAME || 'unitis-videos'}/${file.name}`
    );

    return NextResponse.json({
      success: true,
      files: fileUrls
    });
  } catch (error) {
    console.error('Failed to list uploads:', error);
    return NextResponse.json(
      { error: 'Failed to list uploads' },
      { status: 500 }
    );
  }
}