"use client";
import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import AreasOfExpertise from "@/components/services/AreasOfExpertise";
import ServicesSection from "@/components/services/Hero"; // Assuming "Hero" is the ServicesSection component

const MainLayout: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Header openingHours="06:00 to 20:00" />
      <main>
        {/* Place ServicesSection between the Header and AreasOfExpertise */}
        <ServicesSection title="Our Services" />
        <AreasOfExpertise />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
