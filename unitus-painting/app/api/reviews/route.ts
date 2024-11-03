// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

async function getReviewsData(): Promise<ReviewData> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'reviews.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

async function saveReviewsData(data: ReviewData): Promise<void> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'reviews.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function updateStats(data: ReviewData): Promise<void> {
  const reviews = data.testimonials;
  
  if (reviews.length === 0) {
    data.stats.averageRating = 0;
    data.stats.customerSatisfaction = 0;
    data.stats.featuredAvatars = [];
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  data.stats.averageRating = Number((totalRating / reviews.length).toFixed(1));

  const highRatings = reviews.filter(review => review.rating >= 4).length;
  data.stats.customerSatisfaction = Number(((highRatings / reviews.length) * 100).toFixed(0));

  data.stats.featuredAvatars = reviews
    .filter(review => review.rating >= 4)
    .map(review => review.avatarSrc);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const data = await getReviewsData();

    if (id) {
      const parsedId = parseInt(id);
      const review = data.testimonials.find(r => r.id === parsedId);
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
      return NextResponse.json(review);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await getReviewsData();
    const newReview = await request.json();
    
    const maxId = Math.max(...data.testimonials.map(review => review.id), 0);
    const reviewWithId = { ...newReview, id: maxId + 1 };
    
    data.testimonials.push(reviewWithId);
    await updateStats(data);
    await saveReviewsData(data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await getReviewsData();
    const updatedReview = await request.json();
    
    const index = data.testimonials.findIndex(r => r.id === updatedReview.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    data.testimonials[index] = updatedReview;
    await updateStats(data);
    await saveReviewsData(data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    const data = await getReviewsData();
    const reviewExists = data.testimonials.some(review => review.id === parsedId);
    
    if (!reviewExists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    data.testimonials = data.testimonials.filter(review => review.id !== parsedId);
    await updateStats(data);
    await saveReviewsData(data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}