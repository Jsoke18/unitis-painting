import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type ArticleProps = {
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
};

const Article: React.FC<ArticleProps> = ({ title, content, image, author, date }) => {
  return (
    <Card className="flex flex-col overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <CardContent className="flex flex-col grow p-6">
        <div className="flex items-center text-sm text-zinc-500 mb-2">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        <h3 className="text-xl font-bold leading-tight text-blue-950 mb-3">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-600 mb-4 flex-grow">{content}</p>
        <Button variant="link" className="p-0 h-auto font-semibold text-blue-950 hover:no-underline">
          View More
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const LatestNews: React.FC = () => {
  const articles = [
    {
      title: "Understanding Elastomeric Coating: How it Differs from Traditional Latex Paint",
      content: "When it comes to protecting and beautifying your home or commercial property in Calgary, Okanagan or Vancouver Lower Mainland choosing...",
      image: "/api/placeholder/800/600",
      author: "Unitui Painting",
      date: "Aug 29, 2024"
    },
    {
      title: "The Ultimate Guide to Painting Vinyl Siding in Calgary, Kelowna, & Vancouver Lower",
      content: "When it comes to enhancing the curb appeal of your home, few projects make as big an impact as painting your vinyl siding. Whether your...",
      image: "/api/placeholder/800/600",
      author: "Unitui Painting",
      date: "Aug 22"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-950 mb-12">
          Latest News & Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <Article key={index} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;