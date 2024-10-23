"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tab } from "@headlessui/react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const projects = [
  {
    id: 1,
    title: "Luxury Hotel Renovation",
    category: "Hospitality",
    image: "/api/placeholder/800/600",
    description: "Complete interior and exterior painting for a 5-star hotel.",
  },
  {
    id: 2,
    title: "Beachfront Resort Refresh",
    category: "Hospitality",
    image: "/api/placeholder/800/600",
    description: "Exterior painting and weatherproofing for a coastal resort.",
  },
  {
    id: 3,
    title: "High-Rise Condo Exterior",
    category: "Strata and Condo",
    image: "/api/placeholder/800/600",
    description: "Full exterior repaint of a 30-story condominium building.",
  },
  {
    id: 4,
    title: "Modern Apartment Complex",
    category: "Strata and Condo",
    image: "/api/placeholder/800/600",
    description: "Interior painting for 100+ units in a new apartment development.",
  },
  {
    id: 5,
    title: "Elegant Family Home",
    category: "Residential",
    image: "/api/placeholder/800/600",
    description: "Custom interior painting with specialty finishes for a luxury home.",
  },
  {
    id: 6,
    title: "Victorian House Restoration",
    category: "Residential",
    image: "/api/placeholder/800/600",
    description: "Historical restoration painting for a 19th-century Victorian home.",
  },
  {
    id: 7,
    title: "Corporate Office Tower",
    category: "Commercial",
    image: "/api/placeholder/800/600",
    description: "Complete interior painting for a 20-floor corporate headquarters.",
  },
  {
    id: 8,
    title: "Retail Store Chain Rebrand",
    category: "Commercial",
    image: "/api/placeholder/800/600",
    description: "Nationwide painting project for 50+ retail locations during rebranding.",
  },
];

const categories = [
  "All Projects",
  "Hospitality",
  "Strata and Condo",
  "Residential",
  "Commercial",
];

const ProjectGallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredProjects =
    selectedIndex === 0
      ? projects
      : projects.filter(
          (project) => project.category === categories[selectedIndex]
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Project Portfolio
            </h2>
            <p className="text-xl text-gray-600">
              Explore our diverse range of professional painting projects
            </p>
          </div>

          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex flex-wrap gap-2 justify-center mb-16 p-2 bg-white rounded-xl shadow-sm">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 focus:outline-none
                    ${
                      selected
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group overflow-hidden h-full flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300">
                    <AspectRatio ratio={4 / 3} className="overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                      />
                    </AspectRatio>
                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProjectGallery;