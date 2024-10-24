// lib/storageService.ts
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { Readable } from 'stream';

// Initialize storage
const storage = new Storage({
  projectId: 'hidden-terrain-439216-q7',
  keyFilename: path.join(process.cwd(), 'hidden-terrain-439216-q7-ba8b6d608adc.json')
});

const bucketName = 'unitis-videos';
const bucket = storage.bucket(bucketName);

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    // Create a unique filename
    const ext = path.extname(file.name);
    const fileName = `blog-images/${Date.now()}${ext}`;
    
    // Create a reference to the new file
    const blob = bucket.file(fileName);

    // Convert file buffer to stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // Create write stream
    return new Promise((resolve, reject) => {
      stream
        .pipe(
          blob.createWriteStream({
            resumable: false,
            metadata: {
              contentType: file.type,
              cacheControl: 'public, max-age=31536000',
            },
          })
        )
        .on('error', (error) => {
          console.error('Upload error:', error);
          reject({ success: false, error: error.message });
        })
        .on('finish', async () => {
          try {
            // Generate a public URL without making the file individually public
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
            
            resolve({
              success: true,
              url: publicUrl
            });
          } catch (error) {
            console.error('URL generation error:', error);
            reject({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Failed to generate public URL' 
            });
          }
        });
    });
  } catch (error) {
    console.error('General upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};