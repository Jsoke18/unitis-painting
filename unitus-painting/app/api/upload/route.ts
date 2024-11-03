// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Function to generate a unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const hash = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalName);
  return `${timestamp}-${hash}${ext}`;
}

// Function to ensure upload directory exists
async function ensureUploadDir(uploadDir: string) {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
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
      const uniqueFilename = generateUniqueFilename(file.name);
      
      // Set up upload directory in public folder
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await ensureUploadDir(uploadDir);

      // Full path for file
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Write file
      await fs.writeFile(filePath, buffer);
      
      // Return the public URL
      const publicUrl = `/uploads/${uniqueFilename}`;
      
      return NextResponse.json({ 
        success: true,
        url: publicUrl 
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

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const files = await fs.readdir(uploadDir);
    
    const fileUrls = files.map(file => `/uploads/${file}`);
    
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