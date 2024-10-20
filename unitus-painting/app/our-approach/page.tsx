'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, Check, Star, ThumbsUp } from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const ServiceOverview = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-3xl">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-gray-800 tracking-tight"
          {...fadeIn}
        >
          Unitis Painting Services
        </motion.h1>
        
        <div className="space-y-12">
          <ServiceSection
            icon={<Paintbrush className="w-10 h-10 text-blue-600" />}
            title="Our Process"
            content="At Unitis Painting, we follow a detailed process to meet all your interior and exterior painting needs. Every project begins with a thorough plan, and all preparation and application methods are clearly outlined in our quote documents, ensuring transparency and precision."
          />
          
          <ServiceSection
            icon={<ThumbsUp className="w-10 h-10 text-green-600" />}
            title="Your Benefits"
            listItems={[
              "Convenience: We work around your schedule, offering after-hours or weekend services to meet tight deadlines.",
              "Cleanliness: Our team maintains cleanliness daily and performs a thorough clean-up at project completion.",
              "Communication: We establish clear expectations from the start and keep you informed throughout the project.",
              "Product Selection: We use low-odor, low-VOC paints to minimize any disruption inside your home.",
              "Color Consultation: We assist you in choosing the perfect colors to match your vision.",
              "Quality Checks: Our three-point quality system ensures that our high standards are consistently met, ensuring customer satisfaction."
            ]}
          />
          
          <ServiceSection
            icon={<Star className="w-10 h-10 text-yellow-600" />}
            title="Why Choose Unitis Painting?"
            listItems={[
              "Professionalism: Our painters are always in uniform, making them easy to identify and presenting a professional image.",
              "Personalized Needs Analysis: We listen to your specific needs, such as respecting your preference for keeping a gate closed or working at specific times.",
              "Site Cleanliness: We not only clean up daily but also protect areas not included in the project scope to prevent accidental damage.",
              "Quality Assurance: Our three-point quality check system is in place to ensure top-notch results every time, with real-life examples like how we verify that surfaces are smooth and evenly coated."
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ServiceSection = ({ icon, title, content, listItems }) => (
  <motion.div {...fadeIn} className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="p-8">
      <div className="flex items-center mb-6">
        <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 ml-4">{title}</h2>
      </div>
      {content && <p className="text-gray-600 mb-6 leading-relaxed">{content}</p>}
      {listItems && (
        <ul className="space-y-4">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <span className="text-gray-700 leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </motion.div>
);

export default ServiceOverview;