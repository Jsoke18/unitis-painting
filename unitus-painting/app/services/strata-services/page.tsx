"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import StrataServices from "@/components/servicedetail/StrataServices";


const StrataPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="08:00 to 5:00" />

      {/* Main content */}
      <main className="flex-grow">
    <StrataServices />
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default StrataPage;
