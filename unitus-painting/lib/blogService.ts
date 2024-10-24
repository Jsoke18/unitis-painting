// lib/blogService.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  author: string;
}

interface BlogStore {
  posts: BlogPost[];
  categories: string[];
  isLoading: boolean;
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: number) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  getPost: (id: number) => BlogPost | undefined;
  hydrate: () => void;
}

const initialState = {
  posts: [],
  categories: ["Commercial", "Residential", "Maintenance", "Color Selection", "Painting Tips"],
  isLoading: false
};

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      hydrate: () => {
        const stored = localStorage.getItem('blog-storage');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            set(parsed.state);
          } catch (e) {
            console.error('Failed to hydrate store:', e);
          }
        }
      },
      getPost: (id: number) => {
        const state = get();
        return state.posts.find(post => post.id === id);
      },
      addPost: (post) => set((state) => ({
        posts: [...state.posts, {
          ...post,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0]
        }]
      })),
      updatePost: (updatedPost) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        )
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(post => post.id !== id)
      })),
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      })),
      deleteCategory: (category) => set((state) => ({
        categories: state.categories.filter(c => c !== category),
        posts: state.posts.map(post => ({
          ...post,
          category: post.category === category ? 'Uncategorized' : post.category
        }))
      }))
    }),
    {
      name: 'blog-storage',
      skipHydration: true
    }
  )
);