"use client";
import React from "react";
import Header from "@/components/landing/Header";
import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import AboutUs from "@/components/landing/AboutUs";
import Services from "@/components/landing/Services";
import RecentProjects from "@/components/landing/RecentProjects";
import CustomerFeedback from "@/components/landing/CustomerFeedback";
import NotableClients from "@/components/landing/NotableClients";
import LatestNews from "@/components/landing/LatestNews";
import Newsletter from "@/components/landing/NewsLetter";
import Footer from "@/components/landing/Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Header openingHours="8:00 am - 5:00 pm" />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <RecentProjects />
        <NotableClients />
        <CustomerFeedback />
        <LatestNews />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
