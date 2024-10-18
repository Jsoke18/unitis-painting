"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CommercialServices from "@/components/servicedetail/CommercialServices";


const CommercialPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="08:00 to 5:00" />

      {/* Main content */}
      <main className="flex-grow">
    <CommercialServices />
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default CommercialPage;
