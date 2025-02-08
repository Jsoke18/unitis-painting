// lib/blogService.ts
import { create } from 'zustand';

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
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => Promise<void>;
  updatePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  updateCategories: (categories: string[]) => Promise<void>;
  getPost: (id: number) => BlogPost | undefined;
  getPosts: () => BlogPost[];
  getPostsByCategory: (category: string) => BlogPost[];
  searchPosts: (query: string) => BlogPost[];
  getRelatedPosts: (postId: number) => BlogPost[];
}

export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const convertHtmlToMarkdown = (content: string): string => {
  if (!content) return '';
  let markdown = content
    // ... [keeping your existing markdown conversion logic]
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    // ... [rest of your conversion logic]
    .replace(/&quot;/g, '"');

  return markdown.trim();
};

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      const processedPosts = data.posts.map((post: BlogPost) => ({
        ...post,
        content: convertHtmlToMarkdown(post.content),
        readTime: calculateReadTime(post.content)
      }));
      
      set({ posts: processedPosts, categories: data.categories });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addPost: async (post) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ADD_POST',
          payload: post
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      const processedPost = {
        ...data,
        content: convertHtmlToMarkdown(data.content),
        readTime: calculateReadTime(data.content)
      };
      
      set(state => ({ posts: [...state.posts, processedPost] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePost: async (updatedPost) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'UPDATE_POST',
          payload: updatedPost
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      const processedPost = {
        ...data,
        content: convertHtmlToMarkdown(data.content),
        readTime: calculateReadTime(data.content)
      };
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === processedPost.id ? processedPost : post
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DELETE_POST',
          payload: id
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      set(state => ({
        posts: state.posts.filter(post => post.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // New category management functions
  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ADD_CATEGORY',
          payload: category
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      set({ categories: data.categories });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DELETE_CATEGORY',
          payload: category
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      set(state => ({
        categories: data.categories,
        posts: state.posts.map(post => ({
          ...post,
          category: post.category === category ? 'Uncategorized' : post.category
        }))
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategories: async (categories) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'UPDATE_CATEGORIES',
          payload: categories
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      set({ categories: data.categories });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Existing sync methods
  getPost: (id) => get().posts.find(post => post.id === id),
  getPosts: () => get().posts,
  getPostsByCategory: (category) => get().posts.filter(post => post.category === category),
  searchPosts: (query) => {
    const searchTerms = query.toLowerCase().split(' ');
    return get().posts.filter(post => {
      const searchContent = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchContent.includes(term));
    });
  },
  getRelatedPosts: (postId) => {
    const posts = get().posts;
    const currentPost = posts.find(post => post.id === postId);
    if (!currentPost) return [];

    return posts
      .filter(post => post.id !== postId)
      .map(post => ({
        ...post,
        relevanceScore: [
          post.category === currentPost.category ? 2 : 0,
          ...currentPost.tags.map(tag => post.tags.includes(tag) ? 1 : 0)
        ].reduce((a, b) => a + b, 0)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
      .map(({ relevanceScore, ...post }) => post);
  }
}));

export type BlogStoreType = typeof useBlogStore;