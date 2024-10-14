"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/contact/ContactForm";
import GetStartedSection from "@/components/contact/GetStartedSection";

const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Assuming you have a Header component */}
      <Header openingHours="06:00 to 20:00" />

      {/* Main content */}
      <main className="flex-grow">
        <ContactForm
          title="Contact Unitus Painting"
          description="We’re here to assist with your residential, strata, or commercial painting projects. Whether you need a quote, have questions, or want to book a consultation, contact our team today!"
        />{" "}
      <GetStartedSection title="Ready to get started?" buttonText="Get a Quote" />
      </main>

      {/* Assuming you have a Footer component */}
      <Footer />
    </div>
  );
};

export default ContactPage;
