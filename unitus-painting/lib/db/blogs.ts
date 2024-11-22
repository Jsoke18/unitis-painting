import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
}
export async function createPost(post: Omit<BlogPost, 'id'>) {
    const id = Date.now(); // Simple ID generation
  
    // Start transaction
    const results = await sql.transaction([
      // Insert or get category
      sql`
        INSERT INTO blog_categories (name)
        VALUES (${post.category})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `,
  
      // Insert post
      sql`
        INSERT INTO blog_posts (
          id, title, excerpt, content, image, author, category_id, read_time, date
        ) VALUES (
          ${id},
          ${post.title},
          ${post.excerpt},
          ${post.content},
          ${post.image},
          ${post.author},
          (SELECT id FROM blog_categories WHERE name = ${post.category}),
          ${post.readTime},
          ${new Date().toISOString().split('T')[0]}
        )
        RETURNING *
      `,
  
      // Insert tags
      ...(post.tags || []).map(tagName => sql`
        WITH inserted_tag AS (
          INSERT INTO blog_tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        )
        INSERT INTO post_tags (post_id, tag_id)
        SELECT ${id}, id FROM inserted_tag
        ON CONFLICT DO NOTHING
      `),
  
      // Get complete post
      sql`
        SELECT 
          p.*,
          c.name as category,
          array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
        FROM blog_posts p
        LEFT JOIN blog_categories c ON p.category_id = c.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN blog_tags t ON pt.tag_id = t.id
        WHERE p.id = ${id}
        GROUP BY p.id, c.name, c.id
      `
    ]);
  
    // Return the last result (complete post)
    return results[results.length - 1][0];
  }
export async function updatePost(post: BlogPost) {
    // Start transaction
    return await sql.transaction([
      // Insert or get category
      sql`
        INSERT INTO blog_categories (name)
        VALUES (${post.category})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `,
  
      // Update post
      sql`
        UPDATE blog_posts SET
          title = ${post.title},
          excerpt = ${post.excerpt},
          content = ${post.content},
          image = ${post.image},
          category_id = (
            SELECT id FROM blog_categories WHERE name = ${post.category}
          ),
          read_time = ${post.readTime},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${post.id}
      `,
  
      // Delete existing tags
      sql`DELETE FROM post_tags WHERE post_id = ${post.id}`,
  
      // Insert new tags
      ...(post.tags || []).map(tagName => sql`
        WITH inserted_tag AS (
          INSERT INTO blog_tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        )
        INSERT INTO post_tags (post_id, tag_id)
        SELECT ${post.id}, id FROM inserted_tag
        ON CONFLICT DO NOTHING
      `),
  
      // Get updated post
      sql`
        SELECT 
          p.*,
          c.name as category,
          array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
        FROM blog_posts p
        LEFT JOIN blog_categories c ON p.category_id = c.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN blog_tags t ON pt.tag_id = t.id
        WHERE p.id = ${post.id}
        GROUP BY p.id, c.name, c.id
      `
    ]);
  }