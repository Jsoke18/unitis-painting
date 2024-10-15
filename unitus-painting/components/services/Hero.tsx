import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  backgroundImageSrc: string;
}

const ServicesPage: React.FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col text-center text-white"
    >
      <Hero
        title="Our Services"
        backgroundImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/f28e1b37228e8ea5728b3fb2b09487e8a82965eaea67e7de42de8b4923c24dd6?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
      />
    </motion.main>
  );
};

const Hero: React.FC<PageHeaderProps> = ({ title, backgroundImageSrc }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative flex flex-col h-[400px] max-md:h-[300px]"
    >
      <img
        loading="lazy"
        src={backgroundImageSrc}
        alt={title}
        className="absolute inset-0 object-cover w-full h-full"
      />
      {/* Blue overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute inset-0 bg-blue-900"
      ></motion.div>
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl font-extrabold tracking-wider text-white text-center max-md:text-3xl"
        >
          {title}
        </motion.h1>
      </div>
    </motion.header>
  );
};

export default ServicesPage;