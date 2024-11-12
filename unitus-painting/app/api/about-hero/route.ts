import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AboutHeroContent } from '@/types/AboutHero';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'about-hero.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json({ success: false, error: 'Failed to load content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const content: AboutHeroContent = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'data', 'about-hero.json');
    
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      content,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}