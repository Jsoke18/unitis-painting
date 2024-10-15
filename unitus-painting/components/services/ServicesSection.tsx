import React from 'react';
import ServiceCard from './ServicesCard';
import {
  Paintbrush,
  Home,
  Box,
  LayoutDashboard,
  Hammer,
  Droplets,
  Wrench,
  Drill,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Service {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string; // Add this line

}

const services: Service[] = [
  {
    icon: Paintbrush,
    title: 'Interior Painting',
    description:
      'Transform indoor spaces with skill and precision. From single rooms to entire properties.',
      link: '/services/interior-painting', // Add this line

      
  },
  {
    icon: Home,
    title: 'Exterior Painting',
    description: "Revitalize your property's outer look. Durable finishes for all outdoor areas.",
    link: '/services/exterior-painting', // Add this line
  },
  {
    icon: Box,
    title: 'Cabinet Painting',
    description:
      'Refresh your cabinetry with expert refinishing. Durable, custom finishes for any room.',
      link: '/services/exterior-painting', // Add this line

  },
  {
    icon: LayoutDashboard,
    title: 'Line Painting',
    description:
      'Enhance parking safety and organization. Clear markings for efficient traffic flow.',
      link: '/services/exterior-painting', // Add this line

  },
  {
    icon: Hammer,
    title: 'Carpentry',
    description:
      'Skilled woodwork and repairs. Custom solutions for interior and exterior needs.',
      link: '/services/exterior-painting', // Add this line

  },
  {
    icon: Droplets,
    title: 'Power Washing',
    description:
      'Restore exterior surfaces to pristine condition. Effective cleaning for various materials.',
      link: '/services/exterior-painting', // Add this line

  },
  {
    icon: Wrench,
    title: 'Caulking',
    description:
      'Seal gaps and prevent damage. Precise application for energy efficiency.',
      link: '/services/exterior-painting', // Add this line

  },
  {
    icon: Drill,
    title: 'Repairs',
    description:
      'Prompt fixes for property issues. Quality workmanship on various home & business repairs.',
      link: '/services/exterior-painting', // Add this line

  },
];
const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold tracking-wide leading-tight text-center text-[#1D2440] mb-12">
          Services We Provide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                link={service.link || '#'} // Add this line, using '#' as a fallback
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;