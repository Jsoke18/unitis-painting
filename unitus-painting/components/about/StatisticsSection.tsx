'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import type { StatisticsContent } from '@/app/types/statistics';
import StatisticsCard from './StatisticsCard';

const StatisticsSection: React.FC = () => {
  const [content, setContent] = useState<StatisticsContent | null>(null);
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching statistics content:', error);
      }
    };

    fetchContent();
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 30
  });

  const springScale = useSpring(scale, {
    stiffness: 100,
    damping: 30
  });

  if (!content) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="px-4 sm:px-0 py-16"
      style={{
        opacity,
        y: springY,
        scale: springScale
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.main
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center my-8 sm:my-14"
        >
          {content.statistics.map((statistic, index) => (
            <StatisticsCard
              key={index}
              statistic={statistic}
              index={index}
            />
          ))}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default StatisticsSection;