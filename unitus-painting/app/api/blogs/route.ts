// app/api/blogs/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_PATH = path.join(process.cwd(), 'public/data/blogs.json');

async function getBlogs() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with initial data
    const initialData = {
      posts: [],
      categories: [
        "Commercial", 
        "Residential", 
        "Maintenance", 
        "Color Selection", 
        "Painting Tips"
      ]
    };
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

export async function GET() {
  try {
    const data = await getBlogs();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await getBlogs();
    const post = await request.json();
    
    const newPost = {
      ...post,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    data.posts.push(newPost);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Failed to add blog:', error);
    return NextResponse.json({ error: 'Failed to add blog' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await getBlogs();
    const updatedPost = await request.json();
    
    data.posts = data.posts.map((post: any) => 
      post.id === updatedPost.id ? updatedPost : post
    );
    
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await getBlogs();
    const { id } = await request.json();
    
    data.posts = data.posts.filter((post: any) => post.id !== id);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
