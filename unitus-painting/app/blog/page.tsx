"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

// Sample blog posts data - replace with your actual blog content
const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Paint Color for Your Commercial Space",
    excerpt: "Learn the key factors to consider when selecting paint colors for your business environment...",
    category: "Commercial",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "/api/placeholder/800/400"
  },
  {
    id: 2,
    title: "The Benefits of Regular Exterior Painting Maintenance",
    excerpt: "Discover why maintaining your property's exterior paint is crucial for long-term protection...",
    category: "Maintenance",
    date: "March 10, 2024",
    readTime: "4 min read",
    image: "/api/placeholder/800/400"
  },
  // Add more blog posts as needed
];

const categories = [
  "All",
  "Commercial",
  "Residential",
  "Maintenance",
  "Color Selection",
  "Painting Tips"
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Painting Insights & Expertise
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-2xl mx-auto">
            Expert tips, industry insights, and professional advice from Vancouver's trusted painting contractors
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedCategory === category
                      ? "bg-yellow-400 text-blue-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                    <button className="text-yellow-500 font-medium hover:text-yellow-600 transition-colors duration-200">
                      Read More →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;