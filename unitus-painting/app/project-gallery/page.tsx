"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tab } from "@headlessui/react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Head from "next/head";

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
    description:
      "Interior painting for 100+ units in a new apartment development.",
  },
  {
    id: 5,
    title: "Elegant Family Home",
    category: "Residential",
    image: "/api/placeholder/800/600",
    description:
      "Custom interior painting with specialty finishes for a luxury home.",
  },
  {
    id: 6,
    title: "Victorian House Restoration",
    category: "Residential",
    image: "/api/placeholder/800/600",
    description:
      "Historical restoration painting for a 19th-century Victorian home.",
  },
  {
    id: 7,
    title: "Corporate Office Tower",
    category: "Commercial",
    image: "/api/placeholder/800/600",
    description:
      "Complete interior painting for a 20-floor corporate headquarters.",
  },
  {
    id: 8,
    title: "Retail Store Chain Rebrand",
    category: "Commercial",
    image: "/api/placeholder/800/600",
    description:
      "Nationwide painting project for 50+ retail locations during rebranding.",
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
    <>
      <Header />
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-3">
            Our Project Portfolio
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Explore our diverse range of professional painting projects
          </p>

          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-12">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-xl font-medium leading-5 text-blue-900
                  ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                  ${
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
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
                  <Card className="overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </AspectRatio>
                    <CardContent className="p-6 flex-grow flex flex-col justify-between bg-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {project.description}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-blue-600 mt-2">
                        {project.category}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>{" "}
      <Footer />
    </>
  );
};

export default ProjectGallery;
