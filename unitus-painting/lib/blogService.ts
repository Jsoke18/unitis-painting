import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Declare global window interface
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
}

// Content processing function
function processContent(content: string): string {
  if (!content) return '';
  
  return content
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Add proper spacing around headers
    .replace(/^(#{1,6}\s.*?)$/gm, '\n$1\n')
    // Remove more than 2 consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Clean up any HTML that might have been pasted
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe.*?<\/iframe>/gi, '')
    // Remove any extra whitespace
    .trim();
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      posts: [],
      categories: ["Commercial", "Residential", "Maintenance", "Color Selection", "Painting Tips"],
      isLoading: false,
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          hasHydrated: state
        });
      },

      hydrate: async () => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('blog-storage');
          if (stored) {
            const { state } = JSON.parse(stored);
            // Process all posts' content during hydration
            const processedPosts = state.posts.map((post: BlogPost) => ({
              ...post,
              content: processContent(post.content)
            }));
            set({ ...state, posts: processedPosts, hasHydrated: true });
          } else {
            set({ ...initialState, hasHydrated: true });
          }
        }
      },

      getPost: (id: number) => {
        const state = get();
        const post = state.posts.find(post => post.id === id);
        if (post) {
          return {
            ...post,
            content: processContent(post.content)
          };
        }
        return undefined;
      },

      addPost: (post) => {
        set((state) => {
          const newPost = {
            ...post,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            content: processContent(post.content)
          };
          const updatedPosts = [...state.posts, newPost];
          return {
            ...state,
            posts: updatedPosts
          };
        });
      },

      updatePost: (updatedPost) => {
        set((state) => ({
          ...state,
          posts: state.posts.map(post => 
            post.id === updatedPost.id 
              ? { ...updatedPost, content: processContent(updatedPost.content) }
              : post
          )
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter(post => post.id !== id)
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category]
        }));
      },

      deleteCategory: (category) => {
        set((state) => ({
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
          content: processContent(post.content)
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

// Only attach to window in browser environment
if (typeof window !== 'undefined') {
  window.blogStore = useBlogStore;
}

export type BlogStoreType = typeof useBlogStore;