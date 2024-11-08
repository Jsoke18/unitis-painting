import React from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Award } from "lucide-react";

const statisticsData = [
  {
    icon: CheckCircle,
    value: "4,500+",
    description: "Projects Completed",
    iconColor: "text-green-500"
  },
  {
    icon: Star,
    value: "5.0",
    description: "Average Google Rating",
    iconColor: "text-yellow-400"
  },
  {
    icon: Award,
    value: "5/5",
    description: "Better Business Bureau® Rating",
    iconColor: "text-blue-500"
  }
];

const StatisticsCard: React.FC<{
  icon: React.ElementType;
  value: string;
  description: string;
  iconColor: string;
  index: number;
}> = ({ icon: Icon, value, description, iconColor, index }) => {
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

const StatisticsSection: React.FC = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

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
          {statisticsData.map((stat, index) => (
            <StatisticsCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              description={stat.description}
              iconColor={stat.iconColor}
              index={index}
            />
          ))}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default StatisticsSection;