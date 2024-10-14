import React from 'react';
import ServiceCard from './ServicesCard';
import {
  Paintbrush,
  PaintRoller,
  Box,
  LayoutDashboard,
  Hammer,
  Droplet,
  Wrench,
  Drill,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Service {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Paintbrush,
    title: 'Interior Painting',
    description:
      'Transform indoor spaces with skill and precision. From single rooms to entire properties.',
  },
  {
    icon: PaintRoller,
    title: 'Exterior Painting',
    description:
      "Revitalize your property's outer look. Durable finishes for all outdoor areas.",
  },
  {
    icon: Box,
    title: 'Cabinet Painting',
    description:
      'Refresh your cabinetry with expert refinishing. Durable, custom finishes for any room.',
  },
  {
    icon: LayoutDashboard,
    title: 'Line Painting',
    description:
      'Enhance parking safety and organization. Clear markings for efficient traffic flow.',
  },
  {
    icon: Hammer,
    title: 'Carpentry',
    description:
      'Skilled woodwork and repairs. Custom solutions for interior and exterior needs.',
  },
  {
    icon: Droplet,
    title: 'Power Washing',
    description:
      'Restore exterior surfaces to pristine condition. Effective cleaning for various materials.',
  },
  {
    icon: Wrench,
    title: 'Caulking',
    description:
      'Seal gaps and prevent damage. Precise application for energy efficiency.',
  },
  {
    icon: Drill, // Updated icon for Repairs
    title: 'Repairs',
    description:
      'Prompt fixes for property issues. Quality workmanship on various home & business repairs.',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center rounded-lg mt-36 mb-12">
      <h2 className="text-4xl font-extrabold tracking-wide leading-tight text-center text-gray-800">
        Services We Provide
      </h2>
      <div className="mt-12 w-full px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-full max-w-[270px] mx-auto"
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
