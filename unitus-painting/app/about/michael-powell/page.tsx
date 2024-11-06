"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MainComponent from "@/components/about/MichaelDetail";

const KeithPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header openingHours="8:00 am - 5:00 pm"/>
      
      <main className="flex-1">
        <MainComponent />
      </main>

      <Footer />
    </div>
  );
};

export default KeithPage;