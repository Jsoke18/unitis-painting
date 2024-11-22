"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, Loader2 } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
import debounce from "lodash/debounce";

// Types
interface BlogPost {
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

interface BlogData {
  posts: BlogPost[];
  categories: string[];
}

// Image dimensions
const IMAGE_ASPECT_RATIO = 16 / 9;
const IMAGE_HEIGHT = 240; // Fixed height in pixels
const IMAGE_WIDTH = IMAGE_HEIGHT * IMAGE_ASPECT_RATIO;

// Reusable Blog Card Component
const BlogCard = ({ post }: { post: BlogPost }) => (
  <Link href={`/blog/${post.id}`}>
    <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
      {/* Regular img tag for Google Cloud Storage images */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ height: '240px' }} // Fixed height
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <CardContent className="p-6">
        {/* Rest of the card content remains the same */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{post.readTime}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 text-sm font-medium rounded-full">
            {post.category}
          </span>
          <span className="text-yellow-500 font-medium group-hover:text-yellow-600 transition-colors duration-200">
            Read More →
          </span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </Link>
);

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogData>({ posts: [], categories: [] });
  
  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blog data');
        }
        
        const data: BlogData = await response.json();
        setBlogData(data);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = debounce(() => {
      setShowScrollTop(window.scrollY > 500);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Combine All with other categories
  const allCategories = ["All", ...blogData.categories];

  // Filter posts based on category and search query
  const filteredPosts = blogData.posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchLower === '' || 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)));
    return matchesCategory && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-900 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Blog</h2>
          <p className="text-gray-500">Please wait while we prepare the content</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Blog</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header openingHours="8:00 am - 5:00 pm" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Painting Insights & Expertise
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Expert tips, industry insights, and professional advice from Vancouver's trusted painting contractors
          </motion.p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-md py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Input
                type="text"
                placeholder="Search articles..."
                className={`pl-10 pr-4 py-2 w-full transition-all duration-200 ${
                  isSearchFocused ? 'ring-2 ring-yellow-400' : ''
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedCategory === category
                      ? "bg-yellow-400 text-blue-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-8 right-8 bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-colors duration-200"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default BlogPage;