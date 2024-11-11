'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { AboutContent, defaultAboutContent } from '@/app/types/about';

// Move ReactPlayer outside the main component to avoid re-creation on each render
const ReactPlayer = dynamic(() => import('react-player/lazy'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />
});

const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="w-full relative pt-[56.25%]">
      <div className="absolute top-0 left-0 right-0 bottom-0">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          config={{
            vimeo: {
              playerOptions: {
                responsive: true,
                background: false,
                muted: false,
                pip: true,
              },
            },
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
};

const AboutUs: React.FC = () => {
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/about');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
        setError('Failed to load content. Using default content instead.');
        setContent(defaultAboutContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-12 bg-white min-h-screen"
    >
      {error && (
        <div className="bg-red-50 p-4 mb-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div 
            className="lg:w-1/2 w-full mt-5"
            variants={itemVariants}
          >
            <VideoPlayer url={content.videoUrl} />
          </motion.div>
          
          <div className="lg:w-1/2 space-y-6 flex flex-col justify-center py-4">
            <motion.div
              className="inline-block"
              variants={itemVariants}
            >
              <span className="inline-flex items-center px-3 py-1 bg-amber-100 rounded-full text-amber-600 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 text-amber-400" />
                {content.badge.text}
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-blue-950" 
              variants={itemVariants}
            >
              {content.heading}
            </motion.h2>
            
            {content.paragraphs.map((paragraph, index) => (
              <motion.p 
                key={index}
                className="text-lg text-gray-700 leading-relaxed" 
                variants={itemVariants}
              >
                {paragraph}
              </motion.p>
            ))}
            
            <motion.ul 
              className="space-y-2 text-base text-gray-700 text-lg mt-6" 
              variants={containerVariants}
            >
              {content.bulletPoints.map((point, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center" 
                  variants={itemVariants}
                >
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;