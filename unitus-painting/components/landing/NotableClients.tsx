'use client';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ClientsContent, defaultClientsContent } from '@/app/types/clients';

const NotableClients: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [content, setContent] = useState<ClientsContent>(defaultClientsContent);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching clients content:', error);
        setContent(defaultClientsContent);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const updateWidth = () => {
      const logoWidth = 192; // 48px * 4 (w-48)
      const gap = 32; // 8px * 4 (space-x-8)
      setContainerWidth((logoWidth + gap) * content.clients.length);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [content.clients]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
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
      variants={sectionVariants}
      className="mt-10 py-16 mb-20 overflow-hidden bg-white"
    >
      <div className="max-w-[100vw] mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-center text-blue-950 mb-32"
        >
          {content.heading}
        </motion.h2>
        <motion.div
          variants={itemVariants}
          className="relative h-32 overflow-hidden"
        >
          <motion.div
            animate={{
              x: [0, -containerWidth],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            className="flex space-x-8 absolute"
            style={{ width: `${containerWidth * 2}px` }}
          >
            {[...content.clients, ...content.clients].map((client, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 flex items-center justify-center w-48 h-32 bg-white rounded-lg shadow-sm p-4"
              >
                <img
                  src={client.src}
                  alt={client.alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/placeholder-image.png';
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default NotableClients;