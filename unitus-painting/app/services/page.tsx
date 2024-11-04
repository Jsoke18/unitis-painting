"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ServicesSection from "@/components/services/ServicesSection"; // Correct import for ServicesSection
import AreasOfExpertise from "@/components/services/AreasOfExpertise";
import Hero from "@/components/services/Hero";
import CallToAction from "@/components/services/CallToAction";

const ServicesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="8:00 am - 5:00 pm" />
      {/* Main content */}
      <main className="flex-grow">
        <Hero
          title="Our Services"
          backgroundImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/f28e1b37228e8ea5728b3fb2b09487e8a82965eaea67e7de42de8b4923c24dd6?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
        />

        <AreasOfExpertise />

        <ServicesSection />
       
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
