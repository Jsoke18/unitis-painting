'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Define proper types for the API response
interface Client {
  id: number;
  src: string;
  alt: string;
}

interface ClientsContent {
  heading: string;
  clients: Client[];
}

const defaultClientsContent: ClientsContent = {
  heading: "Our Notable Clients",
  clients: []
};

const NotableClients: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [content, setContent] = useState<ClientsContent>(defaultClientsContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      console.log('🔄 Frontend: Starting to fetch clients data');
      setIsLoading(true);
      try {
        const response = await fetch('/api/clients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Frontend: Received response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ClientsContent = await response.json();
        console.log('✅ Frontend: Successfully fetched clients data:', data);
        setContent(data);
        setError(null);
      } catch (error) {
        console.error('❌ Frontend: Error fetching clients content:', error);
        setError('Failed to load clients data');
        setContent(defaultClientsContent);
      } finally {
        setIsLoading(false);
        console.log('🏁 Frontend: Finished fetching clients data');
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

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
                key={`${client.id}-${index}`}
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