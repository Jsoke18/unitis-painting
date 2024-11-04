// app/blog/[id]/page.tsx
"use client";

import React, { useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/lib/blogService";
import { Button } from "antd";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const BlogPost = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { posts, hydrate, hasHydrated } = useBlogStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Wait for hydration to complete
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Post</h2>
          <p className="text-gray-500">Please wait while we load the content</p>
        </div>
      </div>
    );
  }

  const post = posts.find(p => p.id === Number(params.id));

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header openingHours="8:00 am - 5:00 pm" />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button type="primary" icon={<ArrowLeft />}>
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header openingHours="8:00 am - 5:00 pm" />
      <main className="pt-8 pb-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-8">
          <Link href="/blog">
            <Button 
              icon={<ArrowLeft className="h-4 w-4" />}
              className="hover:bg-gray-100"
            >
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="container mx-auto px-4 mb-12">
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">
                {post.author[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-600">Professional Painter</p>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 
              prose-a:text-blue-600 prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg
              prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
              prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4
              prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Related Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 
                      transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="mt-8">
            <Button 
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleShare}
              className="hover:bg-gray-100"
            >
              Share this article
            </Button>
          </div>
        </article>

        {/* Related Posts - Could be added here */}
        {/* <div className="container mx-auto px-4 max-w-4xl mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          // Add related posts component here
        </div> */}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;