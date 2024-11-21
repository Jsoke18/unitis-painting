'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

// Types for the API response
interface WarrantySection {
  title: string;
  icon: string;
  content: string[];
}

interface WarrantyData {
  hero: {
    title: string;
    subtitle: string;
  };
  sections: WarrantySection[];
}

const WarrantyPage = () => {
  const [data, setData] = React.useState<WarrantyData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Fetch warranty data
  React.useEffect(() => {
    const fetchWarrantyData = async () => {
      try {
        const response = await fetch('/api/warranty');
        if (!response.ok) {
          throw new Error('Failed to fetch warranty data');
        }
        const warrantyData = await response.json();
        setData(warrantyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarrantyData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header openingHours="8:00 am - 5:00 pm" />
        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-700">Loading warranty information...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header openingHours="8:00 am - 5:00 pm" />
        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-lg">Error loading warranty information</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header openingHours="8:00 am - 5:00 pm"/>
      <main className="flex-grow bg-gray-100 pt-16">
        <motion.div
          className="container mx-auto px-4 py-24 max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div
            className="text-center mb-20"
            variants={itemVariants}
          >
            <h1 className="text-4xl font-bold mb-6 text-blue-950">
              {data.hero.title}
            </h1>
            <p className="text-xl text-gray-700">
              {data.hero.subtitle}
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            {data.sections.map((section, index) => (
              <Card 
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl gap-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p 
                      key={pIndex}
                      className="text-lg leading-relaxed text-gray-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default WarrantyPage;