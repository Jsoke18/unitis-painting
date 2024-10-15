import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  backgroundImageSrc: string;
}

const Hero: React.FC<HeroProps> = ({ title, backgroundImageSrc }) => {
  return (
    <header className="relative flex flex-col min-h-[617px] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      />
      <div className="absolute inset-0 bg-blue-900 bg-opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wider leading-tight text-white text-center px-4"
        >
          {title}
        </motion.h1>
      </div>
    </header>
  );
};

export default Hero;