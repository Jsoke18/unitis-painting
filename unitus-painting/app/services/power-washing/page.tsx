"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import PowerWashingDetail from "@/components/servicedetail/PowerWashingDetails";


const PowerWashingDetails: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="06:00 to 20:00" />

      {/* Main content */}
      <main className="flex-grow">
    <PowerWashingDetail />
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default PowerWashingDetails;
