import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

type ProjectCardProps = {
  image: string;
  title: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title }) => {
  return (
    <Link href="/project-gallery">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <img src={image} alt={title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-blue-950 mb-2">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const RecentProjects: React.FC = () => {
  const projects = [
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/b9d70b61f918237578b985586656ae5afd8d14aa1149f2170500a3f425a3e7c7?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "Coal Harbour Strata" },
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/97f1dfc42de7c37375479f0b8938a79dc97335d975a1c2a8180ecfaedba31655?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "Maple Ridge Strata" },
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d2b65ac11b10b7cc7fe041d570c8d11d3018f6eef93b54a2a705d91d231ea18?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "BEST BUY Richmond" },
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/071939787f5eb294d052e07a5376859b965984cd37311c1d5ee684f2f6f638a3?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "Storage Facilities" }
  ];

  return (
    <section className="bg-blue-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-12">
          Our Recent Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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