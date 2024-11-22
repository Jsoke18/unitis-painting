"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import parse from 'html-react-parser';
import Image from "next/image";

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

// Loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
  </div>
);

const LoadingPlaceholder = () => (
  <div className="space-y-4">
    <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
    <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2" />
    <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6" />
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    <Header openingHours="8:00 am - 5:00 pm" />
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading Post...</h2>
      </div>
    </div>
    <Footer />
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen bg-gray-50">
    <Header openingHours="8:00 am - 5:00 pm" />
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
      <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
      <Link 
        href="/blog"
        className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
      >
        <ChevronLeft className="mr-2 h-5 w-5" />
        Back to Blog
      </Link>
    </div>
    <Footer />
  </div>
);

// Content renderer component
const ContentRenderer = ({ content }: { content: string }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingPlaceholder />;
  }

  // Clean HTML content
  const cleanContent = (htmlContent: string) => {
    return htmlContent
      .replace(/<p><br><\/p>/g, '') // Remove empty paragraphs with just <br>
      .replace(/<p>\s*<\/p>/g, '')  // Remove empty paragraphs
      .replace(/(<br>){2,}/g, '<br>') // Reduce multiple <br> tags to single
      .replace(/\s*<br>\s*<\/p>/g, '</p>') // Remove <br> before closing </p>
      .replace(/<p>\s*<br>\s*/g, '<p>'); // Remove <br> after opening <p>
  };

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag') {
        const styleMap: { [key: string]: string } = {
          p: 'mt-4 mb-4 text-gray-700 leading-relaxed block',
          strong: 'font-semibold',
          ul: 'list-disc list-inside mt-4 mb-4 space-y-2',
          li: 'text-gray-700 ml-4',
          a: 'text-blue-600 hover:text-blue-800 underline',
          h1: 'text-4xl font-bold mt-8 mb-4',
          h2: 'text-3xl font-semibold mt-8 mb-4',
          h3: 'text-2xl font-semibold mt-6 mb-3',
          h4: 'text-xl font-semibold mt-4 mb-2',
          blockquote: 'border-l-4 border-gray-200 pl-4 italic my-4',
          img: 'max-w-full h-auto my-4 rounded-lg'
        };

        if (domNode.name in styleMap) {
          domNode.attribs.class = (domNode.attribs.class || '') + ' ' + styleMap[domNode.name];
        }
      }
    }
  };

  const cleanedContent = cleanContent(content);
  return <div className="prose prose-lg max-w-none">{parse(cleanedContent, options)}</div>;
};

// Main component
const BlogPostPage = () => {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching post with ID:', params.id);
        
        const response = await fetch(`/api/blogs?id=${params.id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Post not found' : 'Failed to fetch post');
        }
        
        const data = await response.json();
        console.log('Post data received:', data);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    } else {
      setError('Invalid post ID');
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) return <LoadingState />;
  if (error || !post) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header openingHours="8:00 am - 5:00 pm" />

      {/* Hero Section */}
      <motion.section 
        className="relative h-[60vh] min-h-[400px] bg-blue-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <Link 
            href="/blog"
            className="inline-flex items-center text-white mb-8 hover:text-yellow-400 transition-colors duration-200"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to Blog
          </Link>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {post.title}
          </motion.h1>

          <motion.div 
            className="flex flex-wrap gap-6 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{post.author}</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-6">
                  {post.category}
                </span>

                <ContentRenderer content={post.content} />

                {post.tags && post.tags.length > 0 && (
                  <motion.div 
                    className="mt-8 pt-8 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;