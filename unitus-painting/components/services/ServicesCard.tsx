import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Using ShadCN Button
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Card className="flex flex-col items-center px-6 py-8 mx-auto w-full text-base tracking-wide rounded-lg bg-blue-950 min-h-[380px] shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Icon className="w-14 h-14 text-[#FFB342]" />
          <CardTitle className="pt-4 text-2xl font-bold text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 text-center">
          <p className="leading-7 text-[#b0bcd9]">{description}</p>
          <Button 
            className="mt-6 font-semibold text-white bg-[#FFB342] hover:bg-[#e69b2d] transition-colors duration-300" 
            variant="solid"
            size="lg"
          >
            View More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
