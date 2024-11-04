"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useBlogStore } from "@/lib/blogService";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from 'next/dynamic';

// Dynamically import markdown components
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false
});

const RemarkGfm = dynamic(() => import('remark-gfm'), {
  ssr: false
});

// Convert HTML-style content to markdown
const convertToMarkdown = (content: string): string => {
  if (!content) return '';
  
  return content
    // Convert header tags to markdown
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n\n')
    // Convert paragraph and break tags
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    // Clean up any extra spaces/line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const BlogPostPage = () => {
  const params = useParams();
  const { getPost } = useBlogStore();
  
  const post = getPost(Number(params.id));

  if (!post) {
    return (
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
  }

  // Convert content if it contains HTML tags
  const processedContent = post.content.includes('<') 
    ? convertToMarkdown(post.content) 
    : post.content;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header openingHours="8:00 am - 5:00 pm" />

      {/* Hero Section with Featured Image */}
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
                {/* Category Badge */}
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-6">
                  {post.category}
                </span>

                {/* Markdown Content */}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[RemarkGfm]}
                    components={{
                      h1: ({ ...props }) => (
                        <h1 className="text-4xl font-bold mt-8 mb-4 block" {...props} />
                      ),
                      h2: ({ ...props }) => (
                        <h2 className="text-3xl font-semibold mt-8 mb-4 block" {...props} />
                      ),
                      h3: ({ ...props }) => (
                        <h3 className="text-2xl font-semibold mt-6 mb-3 block" {...props} />
                      ),
                      h4: ({ ...props }) => (
                        <h4 className="text-xl font-semibold mt-4 mb-2 block" {...props} />
                      ),
                      p: ({ ...props }) => (
                        <p className="mt-4 mb-4 text-gray-700 leading-relaxed block whitespace-pre-wrap" {...props} />
                      ),
                    }}
                  >
                    {processedContent}
                  </ReactMarkdown>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
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
                  </div>
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