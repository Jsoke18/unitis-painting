"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CabinetPaintingDetails from "@/components/servicedetail/CabinetPaintingDetails";


const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="8:00 am - 5:00 pm" />

      {/* Main content */}
      <main className="flex-grow">
    <CabinetPaintingDetails />
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default ContactPage;
