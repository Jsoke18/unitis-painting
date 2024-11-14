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
  imageSrc: string;  // Note: Changed from imageUrl to imageSrc to match API
  description: string;
  completionDate?: string;
  location?: string;
  specs?: ProjectSpecs;
}

interface ProjectsData {
  heading: string;
  description: string;
  projects: Project[];
}

const categories = [
  "All Projects",
  "Hospitality",
  "Strata and Condo",
  "Residential",
  "Commercial",
];

// Helper functions remain the same
const formatDate = (dateString?: string) => {
  if (!dateString) return "Date TBA";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return "Date TBA";
  }
};

const formatLocation = (location?: string) => {
  return location || "Location TBA";
};

// ProjectSpecs component remains the same
const ProjectSpecs: React.FC<{ specs?: ProjectSpecs }> = ({ specs }) => {
  const defaultSpecs = {
    area: "Area TBA",
    duration: "Duration TBA",
    team: "Team TBA"
  };

  const displaySpecs = {
    ...defaultSpecs,
    ...specs
  };

  return (
    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
      <div>
        <span className="block font-medium">Area</span>
        {displaySpecs.area}
      </div>
      <div>
        <span className="block font-medium">Duration</span>
        {displaySpecs.duration}
      </div>
      <div>
        <span className="block font-medium">Team Size</span>
        {displaySpecs.team}
      </div>
    </div>
  );
};

// Updated ProjectCard to use imageSrc instead of imageUrl
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <Card className="group overflow-hidden h-full flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300">
    <AspectRatio ratio={4 / 3} className="overflow-hidden">
      <img
        src={project.imageSrc}
        alt={project.title}
        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
      />
    </AspectRatio>
    <CardContent className="p-6 flex-grow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-900 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {formatLocation(project.location)} • Completed {formatDate(project.completionDate)}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {project.description}
        </p>
        <ProjectSpecs specs={project.specs} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-blue-900 text-sm font-medium rounded-full">
          {project.category}
        </span>
      </div>
    </CardContent>
  </Card>
);

const ProjectGallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projectsData, setProjectsData] = useState<ProjectsData>({
    heading: "",
    description: "",
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjectsData(data);
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
      ? projectsData.projects
      : projectsData.projects.filter(
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
              {projectsData.heading}
            </h2>
            <p className="text-xl text-gray-600">
              {projectsData.description}
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