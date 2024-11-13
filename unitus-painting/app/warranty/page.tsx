'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const WarrantyPage = () => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header openingHours="8:00 am - 5:00 pm"/>
      <main className="flex-grow bg-gray-100 pt-16"> {/* Increased top padding */}
        <motion.div
          className="container mx-auto px-4 py-24 max-w-3xl" /* Increased vertical padding */
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-20" /* Increased bottom margin */
            variants={itemVariants}
          >
            <h1 className="text-4xl font-bold mb-6 text-blue-950">
              We've Got You Covered
            </h1>
            <p className="text-xl text-gray-700">
              Our warranty reflects our commitment to quality and customer satisfaction.
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="space-y-8" /* Increased spacing between cards */
            variants={itemVariants}
          >
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  Two-Year Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-700">
                  At Unitus Painting, we believe a warranty should be straightforward and easy to understand. That's why our two-year warranty covers all labor and materials.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  If any surface we've worked on peels or fails during this period, we'll fix it—completely hassle-free and at no additional cost to you.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  Our Commitment to Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-700">
                  Why can we offer this warranty with confidence? It's simple: we never cut corners.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  We ensure that every surface is properly prepared and use the right products for every project. This commitment to quality is the Unitus way.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default WarrantyPage;