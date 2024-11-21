import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL);

// Define types
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category_id: number;
  category?: string;
  tags?: string[];
  readTime: string;
  date: string;
}

// Helper function to fetch post with tags
async function getPostWithTags(postId: number) {
  const [post] = await sql<BlogPost[]>`
    SELECT 
      p.*,
      c.name as category,
      array_agg(t.name) as tags
    FROM blog_posts p
    LEFT JOIN blog_categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN blog_tags t ON pt.tag_id = t.id
    WHERE p.id = ${postId}
    GROUP BY p.id, c.name
  `;
  return post;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Fetch single post with tags
      const post = await getPostWithTags(parseInt(id));
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    // Fetch all posts with tags and categories
    const posts = await sql<BlogPost[]>`
      SELECT 
        p.*,
        c.name as category,
        array_agg(DISTINCT t.name) as tags
      FROM blog_posts p
      LEFT JOIN blog_categories c ON p.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN blog_tags t ON pt.tag_id = t.id
      GROUP BY p.id, c.name
      ORDER BY p.date DESC
    `;

    const categories = await sql<string[]>`
      SELECT name FROM blog_categories ORDER BY name
    `;

    return NextResponse.json({
      posts,
      categories: categories.map(c => c.name)
    });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    // First, get or create category
    const [category] = await sql`
      INSERT INTO blog_categories (name)
      VALUES (${post.category})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    // Insert the post
    const [newPost] = await sql<BlogPost[]>`
      INSERT INTO blog_posts (
        id,
        title,
        excerpt,
        content,
        image,
        author,
        category_id,
        read_time,
        date
      ) VALUES (
        ${Date.now()},
        ${post.title},
        ${post.excerpt},
        ${post.content},
        ${post.image},
        ${post.author},
        ${category.id},
        ${post.readTime},
        ${new Date().toISOString().split('T')[0]}
      )
      RETURNING *
    `;

    // Handle tags
    if (post.tags && post.tags.length > 0) {
      for (const tagName of post.tags) {
        // Insert or get tag
        const [tag] = await sql`
          INSERT INTO blog_tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

        // Create post-tag relationship
        await sql`
          INSERT INTO post_tags (post_id, tag_id)
          VALUES (${newPost.id}, ${tag.id})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    // Return the complete post with tags
    const completePost = await getPostWithTags(newPost.id);
    return NextResponse.json(completePost);
  } catch (error) {
    console.error('Failed to add blog:', error);
    return NextResponse.json({ error: 'Failed to add blog' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const post = await request.json();

    // Update category if needed
    const [category] = await sql`
      INSERT INTO blog_categories (name)
      VALUES (${post.category})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    // Update the post
    await sql`
      UPDATE blog_posts SET
        title = ${post.title},
        excerpt = ${post.excerpt},
        content = ${post.content},
        image = ${post.image},
        author = ${post.author},
        category_id = ${category.id},
        read_time = ${post.readTime},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${post.id}
    `;

    // Update tags
    if (post.tags) {
      // Remove existing tags
      await sql`DELETE FROM post_tags WHERE post_id = ${post.id}`;

      // Add new tags
      for (const tagName of post.tags) {
        const [tag] = await sql`
          INSERT INTO blog_tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

        await sql`
          INSERT INTO post_tags (post_id, tag_id)
          VALUES (${post.id}, ${tag.id})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    // Return the updated post with tags
    const updatedPost = await getPostWithTags(post.id);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Delete post-tag relationships first
    await sql`DELETE FROM post_tags WHERE post_id = ${id}`;
    
    // Then delete the post
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}