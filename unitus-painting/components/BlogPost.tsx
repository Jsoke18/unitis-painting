// app/blog/[id]/page.tsx
"use client";

import React from "react";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { useBlogStore } from "@/lib/blogService";
import { useParams } from "next/navigation";
import { Button } from "antd";

const BlogPost = () => {
  const params = useParams();
  const { getPost } = useBlogStore();
  const post = getPost(Number(params.id));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-8 pb-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-8">
          <Link href="/blog">
            <Button icon={<ArrowLeft />}>
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="container mx-auto px-4 mb-12">
          <div className="relative h-[400px] rounded-xl overflow-hidden">
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
              {post.date}
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
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Related Topics:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share Button */}
          <div className="mt-8">
            <Button icon={<Share2 className="w-4 h-4" />}>
              Share this article
            </Button>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPost;