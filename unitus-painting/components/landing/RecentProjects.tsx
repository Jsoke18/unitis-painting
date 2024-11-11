'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full" // Ensure motion div takes full height
    >
      <Link href="/project-gallery" className="h-full block">
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative h-64">
              <img 
                src={project.imageUrl}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-blue-950 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  {project.category && (
                    <span className="text-sm text-gray-600 block">
                      {project.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const ProjectCardSkeleton = () => (
  <div className="h-full">
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <Skeleton className="h-64 w-full" />
        <div className="p-6 flex-grow">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const RecentProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        // Sort by date and take the 4 most recent projects
        const sortedProjects = data.projects
          .sort((a: Project, b: Project) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);
          
        setProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="bg-blue-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl sm:text-5xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Recent Projects
        </motion.h2>

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/project-gallery">
            <Button
              variant="secondary"
              size="lg"
              className="text-blue-950 bg-white hover:bg-blue-100 transition-colors duration-300 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl"
            >
              <Eye className="mr-2 h-5 w-5" /> View Gallery
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentProjects;