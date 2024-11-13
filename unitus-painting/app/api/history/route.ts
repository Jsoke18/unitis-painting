import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { HistoryContent } from '@/app/types/history';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'history.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to load history content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Read existing content
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const existingContent = JSON.parse(fileContent);

    // Get new content from request
    const newContent = await request.json();

    // Deep merge the new content with existing content
    const updatedContent = {
      ...existingContent,
      ...newContent,
      title: {
        ...existingContent.title,
        ...(newContent.title || {})
      },
      historyCards: newContent.historyCards || existingContent.historyCards,
      timelineItems: newContent.timelineItems || existingContent.timelineItems
    };

    // Write the merged content back to file
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(updatedContent, null, 2),
      'utf8'
    );

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content: updatedContent
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update history content' },
      { status: 500 }
    );
  }
}