import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'public', 'data', 'our-approach.json');

export async function GET() {
  try {
    const content = await fs.readFile(contentPath, 'utf8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Read the existing content first
    const existingContent = JSON.parse(await fs.readFile(contentPath, 'utf8'));
    
    // Get the updates from the request
    const updates = await request.json();
    
    // Deep merge the updates with existing content
    const mergedContent = deepMerge(existingContent, updates);
    
    // Write back the merged content
    await fs.writeFile(contentPath, JSON.stringify(mergedContent, null, 2));
    
    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

// Helper function to deep merge objects
function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  if (Array.isArray(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  });

  return output;
}