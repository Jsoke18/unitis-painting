"use client";
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CommitmentToExcellence from "@/components/about/CommitmentToExcellence";
import StatisticsSection from "@/components/about/StatisticsSection";
import HistorySection from "@/components/about/HistorySection";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/about/vimeo";

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header openingHours="8:00 am - 5:00 pm"/>
      
      <div className="-mt-1">
        <VideoPlayer />
      </div>
      
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 space-y-16 bg-white relative z-10"
        >
          <CommitmentToExcellence />
          <Separator />
          <StatisticsSection />
          <Separator />
          <HistorySection />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;