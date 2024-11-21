import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

// Types
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
  created_at?: string;
  updated_at?: string;
}

export interface BlogResponse {
  posts: BlogPost[];
  categories: string[];
}

// Connection setup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Optional: Configure neon to use WebSocket for transaction support
neonConfig.webSocketConstructor = WebSocket;

// Declare type for the global connection
declare global {
  var dbConnection: Pool | undefined;
}

// Create connection singleton
const createConnection = () => {
  return new Pool({ connectionString: process.env.DATABASE_URL! });
};

// Get or create connection
export const db = globalThis.dbConnection ?? createConnection();

// For development: Prevent multiple connections during hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.dbConnection = db;
}

// Helper function to time queries
export async function timedQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await queryFn();
  const end = performance.now();
  const time = end - start;
  console.log(`Query took ${time}ms`);
  return result;
}

// Blog-specific database functions
export async function getBlogPosts(): Promise<BlogResponse> {
  return await timedQuery(async () => {
    const result = await db.query(`
      WITH post_data AS (
        SELECT 
          p.*,
          c.name as category,
          COALESCE(
            (
              SELECT json_agg(t.name)
              FROM post_tags pt
              JOIN blog_tags t ON pt.tag_id = t.id
              WHERE pt.post_id = p.id
            ),
            '[]'::json
          ) as tags
        FROM blog_posts p
        LEFT JOIN blog_categories c ON p.category_id = c.id
        ORDER BY p.date DESC
      ),
      categories AS (
        SELECT array_agg(name) as names
        FROM blog_categories
      )
      SELECT 
        (
          SELECT json_build_object(
            'posts', COALESCE(json_agg(post_data), '[]'),
            'categories', COALESCE((SELECT names FROM categories), ARRAY[]::text[])
          )
        ) as data
      FROM post_data
    `);

    return result.rows[0]?.data || { posts: [], categories: [] };
  });
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> {
  return await timedQuery(async () => {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Insert category
      const categoryResult = await client.query(
        `INSERT INTO blog_categories (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [post.category]
      );

      const categoryId = categoryResult.rows[0].id;
      const postId = Date.now();

      // Insert post
      await client.query(
        `INSERT INTO blog_posts (
          id, title, excerpt, content, image, author, category_id, read_time, date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)`,
        [postId, post.title, post.excerpt, post.content, post.image, 
         post.author, categoryId, post.readTime]
      );

      // Handle tags
      if (post.tags?.length > 0) {
        for (const tagName of post.tags) {
          const tagResult = await client.query(
            `INSERT INTO blog_tags (name)
             VALUES ($1)
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [tagName]
          );
          
          await client.query(
            `INSERT INTO post_tags (post_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [postId, tagResult.rows[0].id]
          );
        }
      }

      await client.query('COMMIT');

      return {
        ...post,
        id: postId,
        date: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
}

export async function updateBlogPost(post: BlogPost): Promise<BlogPost> {
  return await timedQuery(async () => {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      const categoryResult = await client.query(
        `INSERT INTO blog_categories (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [post.category]
      );

      await client.query(
        `UPDATE blog_posts SET
          title = $1,
          excerpt = $2,
          content = $3,
          image = $4,
          author = $5,
          category_id = $6,
          read_time = $7,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $8`,
        [post.title, post.excerpt, post.content, post.image,
         post.author, categoryResult.rows[0].id, post.readTime, post.id]
      );

      await client.query(
        'DELETE FROM post_tags WHERE post_id = $1',
        [post.id]
      );

      if (post.tags?.length > 0) {
        for (const tagName of post.tags) {
          const tagResult = await client.query(
            `INSERT INTO blog_tags (name)
             VALUES ($1)
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [tagName]
          );
          
          await client.query(
            `INSERT INTO post_tags (post_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [post.id, tagResult.rows[0].id]
          );
        }
      }

      await client.query('COMMIT');
      return post;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
}

export async function deleteBlogPost(id: number): Promise<void> {
  return await timedQuery(async () => {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM post_tags WHERE post_id = $1', [id]);
      await client.query('DELETE FROM blog_posts WHERE id = $1', [id]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
}