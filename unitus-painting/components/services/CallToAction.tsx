import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CallToActionProps {
  title: string;
  buttonText: string;
  imageSrc: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ title, buttonText, imageSrc }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="relative bg-white py-16 lg:py-24"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div variants={itemVariants} className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {title.split(' ').map((word, index) => (
                <motion.span key={index} variants={itemVariants} className="block">{word}</motion.span>
              ))}
            </h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-[#1D2440] text-white hover:bg-[#2A3454] transition-colors duration-300 rounded-full px-8 py-3 text-lg">
                {buttonText}
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="lg:w-1/2 relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
              <img
                src={imageSrc}
                alt="Call to action"
                className="object-cover object-center w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1D2440]"></div>
    </motion.section>
  );
};

export default CallToAction;