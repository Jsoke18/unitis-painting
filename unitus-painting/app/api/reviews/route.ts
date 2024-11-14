import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Review {
  id: number;
  name: string;
  location: string;
  avatarSrc: string;
  content: string;
  rating: number;
  date: string;
}

interface ReviewData {
  testimonials: Review[];
  stats: {
    totalProjects: number;
    yearsInBusiness: number;
    serviceAreas: number;
    averageRating: number;
    customerSatisfaction: number;
    featuredAvatars: string[];
  };
}

// Function to get full data (testimonials and stats)
async function getFullData(client: any) {
  const { rows: data } = await client.query(`
    WITH latest_stats AS (
      SELECT 
        id,
        total_projects as "totalProjects",
        years_in_business as "yearsInBusiness",
        service_areas as "serviceAreas",
        average_rating as "averageRating",
        customer_satisfaction as "customerSatisfaction"
      FROM company_stats
      ORDER BY created_at DESC
      LIMIT 1
    ),
    featured_avatars_array AS (
      SELECT 
        array_agg(avatar_src ORDER BY display_order) as avatars
      FROM featured_avatars
      WHERE company_stats_id = (SELECT id FROM latest_stats)
    ),
    all_testimonials AS (
      SELECT 
        json_agg(
          json_build_object(
            'id', t.id,
            'name', t.name,
            'location', t.location,
            'avatarSrc', t.avatar_src,
            'rating', t.rating,
            'date', t.review_date,
            'content', t.content
          ) ORDER BY t.review_date DESC
        ) as testimonials
      FROM testimonials t
    )
    SELECT 
      json_build_object(
        'stats', (
          SELECT json_build_object(
            'totalProjects', s."totalProjects",
            'yearsInBusiness', s."yearsInBusiness",
            'serviceAreas', s."serviceAreas",
            'averageRating', s."averageRating",
            'customerSatisfaction', s."customerSatisfaction",
            'featuredAvatars', COALESCE(fa.avatars, '{}')
          )
          FROM latest_stats s
          LEFT JOIN featured_avatars_array fa ON true
        ),
        'testimonials', COALESCE(t.testimonials, '[]')
      ) as data
    FROM all_testimonials t
  `);

  if (!data || data.length === 0) {
    throw new Error('Failed to retrieve data');
  }

  return data[0].data;
}

async function updateStats(client: any) {
  try {
    // Update average rating and customer satisfaction
    const { rows } = await client.query(`
      WITH stats AS (
        SELECT 
          AVG(rating) as avg_rating,
          COUNT(CASE WHEN rating >= 4 THEN 1 END)::float / NULLIF(COUNT(*), 0)::float * 100 as satisfaction
        FROM testimonials
      )
      UPDATE company_stats
      SET 
        average_rating = ROUND(COALESCE(stats.avg_rating, 0)::numeric, 2),
        customer_satisfaction = ROUND(COALESCE(stats.satisfaction, 0)::numeric, 0)
      FROM stats
      WHERE id = (SELECT id FROM company_stats ORDER BY created_at DESC LIMIT 1)
      RETURNING *
    `);

    if (!rows || rows.length === 0) {
      throw new Error('No company stats record found to update');
    }

    // Update featured avatars
    const statsId = rows[0].id;

    // Clear existing featured avatars
    await client.query(`
      DELETE FROM featured_avatars 
      WHERE company_stats_id = $1
    `, [statsId]);

    // Get highly rated reviews
    const { rows: avatars } = await client.query(`
      SELECT avatar_src 
      FROM testimonials 
      WHERE rating >= 4 
      ORDER BY review_date DESC
    `);

    // Insert new featured avatars if any exist
    if (avatars.length > 0) {
      const values = avatars.map((avatar, index) => ({
        avatar: avatar.avatar_src,
        order: index
      }));

      const valuesList = values.map(v => `($1, $${v.order * 2 + 2}, $${v.order * 2 + 3})`).join(', ');
      const params = [statsId, ...values.flatMap(v => [v.avatar, v.order])];

      await client.query(`
        INSERT INTO featured_avatars (company_stats_id, avatar_src, display_order)
        VALUES ${valuesList}
      `, params);
    }
  } catch (error) {
    console.error('Error in updateStats:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  const client = await db.connect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
      }

      const { rows } = await client.query(`
        SELECT 
          id,
          name,
          location,
          avatar_src as "avatarSrc",
          rating,
          review_date as date,
          content
        FROM testimonials 
        WHERE id = $1
      `, [parsedId]);

      if (rows.length === 0) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }

      return NextResponse.json(rows[0]);
    }

    const data = await getFullData(client);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    const newReview = await request.json();
    
    const { rows } = await client.query(`
      INSERT INTO testimonials (
        name,
        location,
        avatar_src,
        rating,
        review_date,
        content
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        name,
        location,
        avatar_src as "avatarSrc",
        rating,
        review_date as date,
        content
    `, [
      newReview.name,
      newReview.location,
      newReview.avatarSrc,
      newReview.rating,
      newReview.date,
      newReview.content
    ]);

    await updateStats(client);
    await client.query('COMMIT');

    const data = await getFullData(client);
    return NextResponse.json(data);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: Request) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    const updatedReview = await request.json();
    
    if (!updatedReview.id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const { rows } = await client.query(`
      UPDATE testimonials
      SET 
        name = $1,
        location = $2,
        avatar_src = $3,
        rating = $4,
        review_date = $5,
        content = $6
      WHERE id = $7
      RETURNING *
    `, [
      updatedReview.name,
      updatedReview.location,
      updatedReview.avatarSrc,
      updatedReview.rating,
      updatedReview.date,
      updatedReview.content,
      updatedReview.id
    ]);

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await updateStats(client);
    await client.query('COMMIT');

    const data = await getFullData(client);
    return NextResponse.json(data);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(request: Request) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    const { rows } = await client.query(`
      DELETE FROM testimonials
      WHERE id = $1
      RETURNING *
    `, [parsedId]);

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await updateStats(client);
    await client.query('COMMIT');

    const data = await getFullData(client);
    return NextResponse.json(data);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  } finally {
    client.release();
  }
}