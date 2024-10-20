'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Head from 'next/head';
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
      opacity: 1
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Unitus Painting - Two-Year Warranty | Quality Painting Services</title>
        <meta name="description" content="Unitus Painting offers a hassle-free two-year warranty covering all labor and materials. Learn about our commitment to quality and customer satisfaction." />
        <meta name="keywords" content="Unitus Painting, warranty, painting services, quality assurance, customer satisfaction" />
      </Head>
      <Header />
      <main className="flex-grow bg-gray-100">
        <motion.div
          className="container mx-auto px-4 py-16 mb-52 mt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl font-bold text-center mb-12 text-blue-950 " variants={itemVariants}>
          We've Got You Covered

          </motion.h1>
          <motion.div className="grid gap-8 md:grid-cols-2 mt-32" variants={itemVariants}>
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Shield className="mr-2 text-blue-600" />
                  Two-Year Warranty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">At Unitus Painting, we believe a warranty should be straightforward and easy to understand. That's why our two-year warranty covers all labor and materials. If any surface we've worked on peels or fails during this period, we'll fix it—completely hassle-free and at no additional cost to you.</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Shield className="mr-2 text-blue-600" />
                  Our Commitment to Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Why can we offer this warranty with confidence? It's simple: we never cut corners. We ensure that every surface is properly prepared and use the right products for every project. This commitment to quality is the Unitus way.</p>
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