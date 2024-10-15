'use client'
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ServiceCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string; // Add this new prop
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, link }) => {
  return (
    <Card className="flex flex-col items-start px-6 py-8 w-full text-base tracking-wide rounded-lg bg-[#1D2440] min-h-[380px] shadow-lg">
      <CardHeader className="flex flex-col items-start p-0 mb-4">
        <Icon className="w-14 h-14 text-[#FFB342] mb-4" />
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <p className="leading-7 text-[#b0bcd9] mb-6">{description}</p>
      </CardContent>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href={link} passHref>
          <Button
            className="mt-auto font-semibold text-[#FFB342] hover:text-[#e69b2d] transition-colors duration-300 p-0"
            variant="link"
          >
            View More
          </Button>
        </Link>
      </motion.div>
    </Card>
  );
};

export default ServiceCard;