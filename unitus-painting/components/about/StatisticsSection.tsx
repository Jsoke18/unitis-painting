import React from 'react';
import { motion } from 'framer-motion';
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
}> = ({ icon: Icon, value, description, iconColor }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className="w-full sm:w-64"
    >
      <Card className="h-auto sm:h-64 flex flex-row sm:flex-col items-center sm:justify-between p-4 sm:p-6 my-2 sm:my-8">
        <div className="flex items-center sm:flex-col flex-1">
          <Icon className={`w-12 h-12 sm:w-16 sm:h-16 sm:mb-4 ${iconColor}`} />
          <CardContent className="text-left sm:text-center pl-4 sm:pl-0 flex-1">
            <motion.h3 
              className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
              whileHover={{ scale: 1.1, color: "#3B82F6" }}
            >
              {value}
            </motion.h3>
            <p className="text-gray-600 text-sm sm:text-base">{description}</p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

const StatisticsSection: React.FC = () => {
  return (
    <motion.div
      className="px-4 sm:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.main
          className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 justify-center my-8 sm:my-14"
        >
          {statisticsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full sm:w-auto"
            >
              <StatisticsCard
                icon={stat.icon}
                value={stat.value}
                description={stat.description}
                iconColor={stat.iconColor}
              />
            </motion.div>
          ))}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default StatisticsSection;