'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Award } from "lucide-react";
import type { StatisticsContent } from '@/app/types/statistics';

const iconMap = {
  CheckCircle,
  Star,
  Award
};

const StatisticsCard: React.FC<{
  statistic: StatisticItem;
  index: number;
}> = ({ statistic, index }) => {
  const { value, description, iconType, iconColor } = statistic;
  const Icon = iconMap[iconType];
  
  const cardRef = React.useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.2 + 0.3
      }
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.2 + 0.4
      }
    }
  };

  const springConfig = {
    type: "spring",
    stiffness: 400,
    damping: 25
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.05,
        transition: springConfig
      }}
      whileTap={{ scale: 0.95 }}
      className="w-full sm:w-64"
    >
      <Card className="h-auto sm:h-64 flex flex-col justify-center items-center p-6 my-2 sm:my-8
                    backdrop-blur-sm bg-white/90 hover:bg-white transition-colors duration-300">
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="relative flex items-center justify-center"
          >
            <motion.div
              className="absolute inset-0 bg-gray-100 rounded-full opacity-20"
              whileHover={{ scale: 1.5, opacity: 0.1 }}
              style={{ width: '80px', height: '80px' }}
            />
            <Icon className={`w-16 h-16 ${iconColor} relative z-10`} />
          </motion.div>
          
          <CardContent className="text-center p-0 mt-4">
            <motion.div
              variants={numberVariants}
              className="overflow-hidden"
            >
              <motion.h3
                className="text-2xl font-bold mb-2"
                whileHover={{ 
                  scale: 1.1, 
                  color: "#3B82F6",
                  transition: springConfig
                }}
              >
                {value}
              </motion.h3>
            </motion.div>
            <motion.p 
              className="text-gray-600 text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
            >
              {description}
            </motion.p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatisticsCard;