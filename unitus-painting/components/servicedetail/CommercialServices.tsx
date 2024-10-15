import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { commercialServicesContent, ServiceItem, ProjectItem } from './CommercialServiceContent';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Header: React.FC<{ title: string; image: string }> = ({ title, image }) => (
  <motion.header
    className="relative w-full min-h-[389px] text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <img src={image} alt="Commercial building background" className="absolute inset-0 object-cover w-full h-full" />
    <div className="absolute inset-0 bg-blue-950 bg-opacity-80 flex items-center justify-center">
      <motion.h1
        className="text-6xl font-extrabold tracking-wider text-center px-4"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        {title}
      </motion.h1>
    </div>
  </motion.header>
);

const ServiceList: React.FC<{ services: ServiceItem[]; title: string }> = ({ services, title }) => (
  <Card className="w-full h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-3xl font-bold text-blue-950">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow pt-4">
      <ul className="space-y-4">
        {services.map((service, index) => (
          <motion.li
            key={index}
            className="flex items-center space-x-3"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          >
            <Check className="text-green-500 h-6 w-6 flex-shrink-0" />
            <span className="text-zinc-700 text-lg leading-tight">{service.name}</span>
          </motion.li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
const ProjectShowcase: React.FC<{ projects: ProjectItem[]; title: string }> = ({ projects, title }) => (
    <section className="mt-16">
      <motion.h2
        className="text-3xl font-extrabold text-blue-950 text-center mb-8"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        {title}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 1,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
              }
            }}
            className="cursor-pointer"
          >
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl">
              <CardContent className="p-0">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-950">{project.title}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );

const CallToAction: React.FC<{ title: string; buttonText: string }> = ({ title, buttonText }) => (
  <motion.section
    className="bg-amber-400 py-16 mt-16"
    variants={fadeIn}
    initial="initial"
    animate="animate"
  >
    <div className="container mx-auto flex items-center justify-center space-x-6">
      <h2 className="text-3xl font-bold text-black">{title}</h2>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant="default" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
          {buttonText}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  </motion.section>
);

const CommercialServices: React.FC = () => {
  return (
    <div className="bg-white">
      <Header title={commercialServicesContent.headerTitle} image={commercialServicesContent.headerImage} />
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 h-full">
            <ServiceList services={commercialServicesContent.services} title={commercialServicesContent.servicesTitle} />
          </aside>
          <section className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardContent className="p-0 flex-grow flex flex-col">
                <motion.img
                  src={commercialServicesContent.descriptionImage}
                  alt="Commercial building services illustration"
                  className="w-full h-64 object-cover rounded-t-lg"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                />
                <div className="p-6 flex-grow flex flex-col">
                  <motion.div
                    className="mb-4"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                  >
                    <Badge variant="default" className="bg-blue-950 text-white hover:bg-blue-700">
                      Featured Project
                    </Badge>
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-blue-950 mb-2"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                  >
                    Staples in Burnaby: Exterior Power Washing and Repainting
                  </motion.h2>
                  <motion.h3
                    className="text-xl font-semibold text-black mb-4"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                  >
                    {commercialServicesContent.descriptionTitle}
                  </motion.h3>
                  <motion.p
                    className="text-gray-700 leading-relaxed flex-grow"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                  >
                    {commercialServicesContent.descriptionText}
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
        <ProjectShowcase projects={commercialServicesContent.projects} title={commercialServicesContent.projectShowcaseTitle} />
      </main>
      <CallToAction title={commercialServicesContent.ctaTitle} buttonText={commercialServicesContent.ctaButtonText} />
    </div>
  );
};

export default CommercialServices;