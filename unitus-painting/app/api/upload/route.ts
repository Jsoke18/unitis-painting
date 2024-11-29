// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';

// Initialize Google Cloud Storage client
const storage = new Storage({
  projectId: 'hidden-terrain-439216',
  keyFilename: 'C:/Users/mucky/Documents/GitHub/unitis-painting/hidden-terrain-439216-q7-2c71aad589a1.json'
});

const bucket = storage.bucket('unitis-videos');

// Function to generate a unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const hash = crypto.randomBytes(8).toString('hex');
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  return `blog-images/${timestamp}-${hash}${ext}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, WebP, and GIF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    try {
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const filename = generateUniqueFilename(file.name);

      // Create a new blob in the bucket
      const blob = bucket.file(filename);
      
      // Upload file
      return new Promise(async (resolve, reject) => {
        try {
          await blob.save(buffer, {
            metadata: {
              contentType: file.type,
            },
            resumable: false
          });

          // Construct the public URL
          const publicUrl = `https://storage.googleapis.com/unitis-videos/${filename}`;

          resolve(NextResponse.json({
            success: true,
            url: publicUrl
          }));
        } catch (error) {
          console.error('Upload error:', error);
          reject(NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
          ));
        }
      });

    } catch (error) {
      console.error('Upload processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process upload' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Optional: List uploads
export async function GET() {
  try {
    const [files] = await bucket.getFiles({
      prefix: 'blog-images/',
    });

    const fileUrls = files.map(file => 
      `https://storage.googleapis.com/unitis-videos/${file.name}`
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