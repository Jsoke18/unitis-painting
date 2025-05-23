"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tab } from "@headlessui/react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

interface ProjectSpecs {
  area?: string;
  duration?: string;
  team?: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  completionDate?: string;
  location?: string;
  specs?: ProjectSpecs;
}

const categories = [
  "All Projects",
  "Hospitality",
  "Strata and Condo",
  "Residential",
  "Commercial",
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const hasLocationOrDate = 
    (project.location && project.location !== "Location TBA") || 
    (project.completionDate && project.completionDate !== "Date TBA");

  const formatInfo = () => {
    const parts = [];
    if (project.location && project.location !== "Location TBA") {
      parts.push(project.location);
    }
    if (project.completionDate && project.completionDate !== "Date TBA") {
      parts.push(`Completed ${project.completionDate}`);
    }
    return parts.join(" • ");
  };

  return (
    <Card className="group overflow-hidden h-full flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300">
      <AspectRatio ratio={4 / 3} className="overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        />
      </AspectRatio>
      <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-75%)]">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-900 transition-colors duration-200">
            {project.title}
          </h3>
          {hasLocationOrDate && (
            <p className="text-gray-600 text-sm mb-3">
              {formatInfo()}
            </p>
          )}
          {project.description && project.description !== "N/A" && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-blue-900 text-sm font-medium rounded-full">
            {project.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectGallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/data/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    selectedIndex === 0
      ? projects
      : projects.filter(
          (project) => project.category === categories[selectedIndex]
        );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header openingHours="8:00 am - 5:00 pm"/>
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
                        ? "bg-blue-900 text-white shadow-md"
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
                  <ProjectCard project={project} />
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