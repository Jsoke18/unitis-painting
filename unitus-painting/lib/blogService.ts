import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Type Definitions
declare global {
  interface Window {
    blogStore: ReturnType<typeof useBlogStore>;
  }
}

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
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  hydrate: () => Promise<void>;
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: number) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  getPost: (id: number) => BlogPost | undefined;
  getPosts: () => BlogPost[];
  getPostsByCategory: (category: string) => BlogPost[];
  searchPosts: (query: string) => BlogPost[];
  getRelatedPosts: (postId: number) => BlogPost[];
}

// Initial state
const initialState = {
  posts: [],
  categories: ["Commercial", "Residential", "Maintenance", "Color Selection", "Painting Tips"],
  isLoading: false,
  hasHydrated: false,
};

// Content processing utilities
const convertHtmlToMarkdown = (content: string): string => {
  if (!content) return '';
  
  let markdown = content
    // Convert HTML headers to markdown
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    
    // Convert basic formatting
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    
    // Convert lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    
    // Convert paragraphs and line breaks
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    
    // Clean up inline styles and spans
    .replace(/style="[^"]*"/g, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    
    // Clean up spaces and normalize line endings
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    
    // Remove potentially harmful elements
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe.*?<\/iframe>/gi, '');

  return markdown.trim();
};

// Calculate read time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Create the store
export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasHydrated: (state) => {
        set({
          hasHydrated: state
        });
      },

      hydrate: async () => {
        if (typeof window !== 'undefined') {
          set({ isLoading: true });
          try {
            const stored = localStorage.getItem('blog-storage');
            if (stored) {
              const { state } = JSON.parse(stored);
              const processedPosts = state.posts.map((post: BlogPost) => ({
                ...post,
                content: convertHtmlToMarkdown(post.content),
                readTime: calculateReadTime(post.content)
              }));
              set({ ...state, posts: processedPosts, hasHydrated: true });
            } else {
              set({ ...initialState, hasHydrated: true });
            }
          } catch (error) {
            console.error('Error hydrating blog store:', error);
            set({ ...initialState, hasHydrated: true });
          } finally {
            set({ isLoading: false });
          }
        }
      },

      getPost: (id: number) => {
        const state = get();
        const post = state.posts.find(post => post.id === id);
        if (post) {
          return {
            ...post,
            content: convertHtmlToMarkdown(post.content)
          };
        }
        return undefined;
      },

      getPosts: () => {
        const state = get();
        return state.posts.map(post => ({
          ...post,
          content: convertHtmlToMarkdown(post.content)
        }));
      },

      getPostsByCategory: (category: string) => {
        const state = get();
        return state.posts
          .filter(post => post.category === category)
          .map(post => ({
            ...post,
            content: convertHtmlToMarkdown(post.content)
          }));
      },

      searchPosts: (query: string) => {
        const state = get();
        const searchTerms = query.toLowerCase().split(' ');
        
        return state.posts
          .filter(post => {
            const searchContent = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
            return searchTerms.every(term => searchContent.includes(term));
          })
          .map(post => ({
            ...post,
            content: convertHtmlToMarkdown(post.content)
          }));
      },

      getRelatedPosts: (postId: number) => {
        const state = get();
        const currentPost = state.posts.find(post => post.id === postId);
        if (!currentPost) return [];

        return state.posts
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
          .map(({ relevanceScore, ...post }) => ({
            ...post,
            content: convertHtmlToMarkdown(post.content)
          }));
      },

      addPost: (post) => {
        set((state) => {
          const newPost = {
            ...post,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            content: convertHtmlToMarkdown(post.content),
            readTime: calculateReadTime(post.content)
          };
          return {
            ...state,
            posts: [...state.posts, newPost]
          };
        });
      },

      updatePost: (updatedPost) => {
        set((state) => ({
          ...state,
          posts: state.posts.map(post => 
            post.id === updatedPost.id 
              ? {
                  ...updatedPost,
                  content: convertHtmlToMarkdown(updatedPost.content),
                  readTime: calculateReadTime(updatedPost.content)
                }
              : post
          )
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          ...state,
          posts: state.posts.filter(post => post.id !== id)
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          ...state,
          categories: [...new Set([...state.categories, category])]
        }));
      },

      deleteCategory: (category) => {
        set((state) => ({
          ...state,
          categories: state.categories.filter(c => c !== category),
          posts: state.posts.map(post => ({
            ...post,
            category: post.category === category ? 'Uncategorized' : post.category
          }))
        }));
      }
    }),
    {
      name: 'blog-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        posts: state.posts.map(post => ({
          ...post,
          content: convertHtmlToMarkdown(post.content)
        })),
        categories: state.categories
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      }
    }
  )
);

// Attach to window in browser environment
if (typeof window !== 'undefined') {
  window.blogStore = useBlogStore;
}

export type BlogStoreType = typeof useBlogStore;