import { NextResponse } from 'next/server';
import { createPost, updatePost } from '@/lib/db/blogs';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

export async function GET(request: Request) {
  console.log('GET request received');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('Query params - id:', id);
    
    if (id) {
      const [post] = await sql`
        SELECT 
          p.*,
          c.name as category,
          array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
        FROM blog_posts p
        LEFT JOIN blog_categories c ON p.category_id = c.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN blog_tags t ON pt.tag_id = t.id
        WHERE p.id = ${parseInt(id)}
        GROUP BY p.id, c.name, c.id
      `;
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    console.log('Fetching all posts');
    const posts = await sql`
      SELECT 
        p.*,
        c.name as category,
        array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
      FROM blog_posts p
      LEFT JOIN blog_categories c ON p.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN blog_tags t ON pt.tag_id = t.id
      GROUP BY p.id, c.name, c.id
      ORDER BY p.date DESC, p.updated_at DESC
    `;
    console.log('Posts fetched:', posts.length);

    const categories = await sql`SELECT * FROM blog_categories ORDER BY name`;
    console.log('Categories fetched:', categories);

    return NextResponse.json({
      posts,
      categories: categories.map(c => c.name)
    });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    const newPost = await createPost(post);
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const post = await request.json();
    const updatedPost = await updatePost(post);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    // First delete related records in post_tags
    await sql`
      DELETE FROM post_tags 
      WHERE post_id = ${id}
    `;
    
    // Then delete the post itself
    const result = await sql`
      DELETE FROM blog_posts 
      WHERE id = ${id} 
      RETURNING id
    `;
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post', details: error.message },
      { status: 500 }
    );
  }
}