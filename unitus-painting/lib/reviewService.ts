// lib/reviewService.ts
import { create } from 'zustand';

export interface Review {
  id: number;
  name: string;
  location: string;
  avatarSrc: string;
  content: string;
  rating: number;
  date: string;
}

interface ReviewStats {
  totalProjects: number;
  yearsInBusiness: number;
  serviceAreas: number;
  averageRating: number;
  customerSatisfaction: number;
  featuredAvatars: string[];
}

interface ReviewStore {
  reviews: Review[];
  stats: ReviewStats | null;
  isLoading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
  addReview: (review: Omit<Review, 'id'>) => Promise<void>;
  updateReview: (review: Review) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  reviews: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reviews', {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      set({
        reviews: data.testimonials,
        stats: data.stats,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch reviews', 
        isLoading: false 
      });
    }
  },

  addReview: async (reviewData: Omit<Review, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add review');
      }

      set({ 
        reviews: data.testimonials,
        stats: data.stats,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error adding review:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add review', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateReview: async (updatedReview: Review) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update review');
      }

      set({ 
        reviews: data.testimonials,
        stats: data.stats,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error updating review:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update review', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteReview: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review');
      }

      set({ 
        reviews: data.testimonials,
        stats: data.stats,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete review', 
        isLoading: false 
      });
      throw error;
    }
  },
}));

// Debug helper
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.reviewStore = useReviewStore;
}