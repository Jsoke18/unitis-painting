import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full text-white h-[500px] lg:h-[600px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9dc7082eebedd185118f716dd4106e7fb7af0f1c9a5225c7cf2d0b62945ab10f?apiKey=a05a9fe5da54475091abff9f564d40f8&"
          alt="Professional painters at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950 bg-opacity-70" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c50bfc0b5564c810ab319a1e3f5823bc288c4926cbddf24070062312f3e06e94?apiKey=a05a9fe5da54475091abff9f564d40f8&"
              alt="Location icon"
              className="w-5 h-5 object-contain"
            />
            <p className="text-sm sm:text-base font-medium">
              Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6"
          >
            Professional Painting Services Across Canada
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-base font-semibold bg-amber-400 text-blue-950 rounded-md shadow-lg flex items-center space-x-2 transition-colors hover:bg-amber-300 mt-10"
            >
              <span>Explore Our Services</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;