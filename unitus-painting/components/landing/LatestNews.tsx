import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useBlogStore } from "@/lib/blogService";
import Link from "next/link";

type ArticleProps = {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
};

const Article: React.FC<ArticleProps> = ({ id, title, content, image, author, date }) => {
  const contentPreview = content
    .replace(/<[^>]+>/g, '')
    .slice(0, 150) + '...';

  return (
    <Card className="flex flex-col overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <CardContent className="flex flex-col grow p-6">
        <div className="flex items-center text-sm text-zinc-500 mb-2">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(date).toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}</span>
        </div>
        <h3 className="text-xl font-bold leading-tight text-blue-950 mb-3">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-600 mb-4 flex-grow">
          {contentPreview}
        </p>
        <Link href={`/blog/${id}`}>
          <Button variant="link" className="p-0 h-auto font-semibold text-blue-950 hover:no-underline">
            View More
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

// Loading skeleton component
const ArticleSkeleton = () => (
  <Card className="flex flex-col overflow-hidden">
    <div className="w-full h-48 bg-gray-200 animate-pulse" />
    <CardContent className="flex flex-col grow p-6">
      <div className="flex items-center mb-2">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="mx-2">•</div>
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-3" />
      <div className="space-y-2 mb-4 flex-grow">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
    </CardContent>
  </Card>
);

const LatestNews: React.FC = () => {
  const { getPosts, hydrate, hasHydrated } = useBlogStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    hydrate();
  }, [hydrate]);

  // Don't render anything on the server side
  if (!mounted) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-blue-950 mb-12">
            Latest News & Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ArticleSkeleton />
            <ArticleSkeleton />
          </div>
        </div>
      </section>
    );
  }

  const allPosts = getPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-950 mb-12">
          Latest News & Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!hasHydrated ? (
            <>
              <ArticleSkeleton />
              <ArticleSkeleton />
            </>
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Article
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                image={post.image}
                author={post.author}
                date={post.date}
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500">No articles available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;