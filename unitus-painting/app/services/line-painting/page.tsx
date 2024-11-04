"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import LinePaintingDetails from "@/components/servicedetail/LinePainting";


const LinePaintingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="8:00 am - 5:00 pm" />

      {/* Main content */}
      <main className="flex-grow">
    <LinePaintingDetails />
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default LinePaintingPage;
