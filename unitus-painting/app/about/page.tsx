"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/about/Hero";
import CommitmentToExcellence from "@/components/about/CommitmentToExcellence";
import StatisticsSection from "@/components/about/StatisticsSection";
import HistorySection from "@/components/about/HistorySection";
import ExpertTeam from "@/components/about/ExpertTeam";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/about/vimeo"; // Import the new VideoPlayer component

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header openingHours="06:00 to 20:00" />
      
      <main className="flex-grow">
        <Hero
          title="About Unitis Painting"
          backgroundImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/188256efd1fb49af755bc5633348461fe3fa53373c0cacee5a565376fb4be2f2?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
        />
        
        <VideoPlayer /> {/* Add the VideoPlayer component here */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 space-y-16"
        >
          <CommitmentToExcellence />
          <Separator />
          <StatisticsSection />
          <Separator />
          <HistorySection />
          <Separator />
          <ExpertTeam />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;