'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HistoryContent } from '@/app/types/history';

const defaultContent: HistoryContent = {
  title: {
    badge: "Our History",
    mainHeading: "Let's Build Something Together",
    subHeading: ""
  },
  historyCards: [],
  timelineItems: []
};

const HistorySection = () => {
  const [content, setContent] = useState<HistoryContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/history');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching history content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Animation variants remain the same...
  const revealVariants = {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0 0 0)",
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1.000],
      }
    }
  };

  const floatingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.2,
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    })
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { title, historyCards, timelineItems } = content;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Section */}
          <div className="lg:w-1/2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="mb-12"
            >
              <div className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full mb-6">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">{title.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
                {title.mainHeading}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {title.subHeading}
              </p>
            </motion.div>

            {/* History Cards */}
            {historyCards.map((card, index) => (
              <motion.div
                key={index}
                variants={floatingVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                custom={index}
                className="mb-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300"
              >
                <h3 className="flex items-center text-xl font-semibold text-blue-800 mb-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="mr-3 text-blue-500" size={24} />
                  </motion.div>
                  {card.title}
                </h3>
                <p className="text-gray-600 ml-9 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Timeline */}
          <div className="lg:w-1/2 relative">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: "linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)" }}
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="h-full w-full bg-blue-500"
                variants={pathVariants}
                style={{ 
                  originY: 0,
                  scaleY: 0
                }}
                animate={{
                  scaleY: 1,
                  transition: { duration: 1.5, ease: "easeInOut" }
                }}
              />
            </motion.div>

            <div className="relative pl-8">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  className="mb-12 last:mb-0"
                >
                  <motion.div
                    variants={dotVariants}
                    custom={index}
                    className="absolute left-[-8px] w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)" 
                    }}
                    className="bg-white p-6 rounded-lg shadow-md ml-6"
                  >
                    <motion.h3 
                      className="text-xl font-semibold text-blue-600 mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      {item.year}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;