import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

const initialState = {
  posts: [],
  categories: ["Commercial", "Residential", "Maintenance", "Color Selection", "Painting Tips"],
  isLoading: false,
  hasHydrated: false
};

/**
 * Cleans HTML content by removing HTML tags and formatting
 */
function cleanContent(htmlContent: string): string {
  if (!htmlContent) return '';
  
  return htmlContent
    .replace(/<[^>]+>/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/background-color:[^;]+;/g, '')
    .replace(/\s+/g, ' ')
    .replace(/(\n\s*){3,}/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

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
          const stored = localStorage.getItem('blog-storage');
          if (stored) {
            const { state } = JSON.parse(stored);
            set({ ...state, hasHydrated: true });
          } else {
            set({ ...initialState, hasHydrated: true });
          }
        }
      },

      getPost: (id: number) => {
        const state = get();
        const post = state.posts.find(post => post.id === id);
        if (post) {
          // Return a new object with cleaned content
          return {
            ...post,
            content: cleanContent(post.content)
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
            content: cleanContent(post.content) // Clean content when adding post
          };
          const updatedPosts = [...state.posts, newPost];
          return {
            posts: updatedPosts
          };
        });
      },

      updatePost: (updatedPost) => {
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === updatedPost.id 
              ? { ...updatedPost, content: cleanContent(updatedPost.content) } // Clean content when updating
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
        posts: state.posts,
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

// Type-safe way to debug the store
declare global {
  interface Window {
    blogStore?: ReturnType<typeof useBlogStore>;
  }
}

if (typeof window !== 'undefined') {
  window.blogStore = useBlogStore;
}