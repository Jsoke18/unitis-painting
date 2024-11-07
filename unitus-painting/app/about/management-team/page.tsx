"use client";
import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ExpertTeam from "@/components/about/ExpertTeam";

const ManagementTeamPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header openingHours="8:00 am - 5:00 pm"/>
      <main className="flex-grow">
        <ExpertTeam />
      </main>
      <Footer />
    </div>
  );
};

export default ManagementTeamPage;