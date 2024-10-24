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
    >
      <Card className="w-64 h-64 flex flex-col items-center justify-between p-6 mt-32 mb-32">
        <Icon className={`w-16 h-16 mb-4 ${iconColor}`} />
        <CardContent className="text-center">
          <motion.h3 
            className="text-2xl font-bold mb-2"
            whileHover={{ scale: 1.1, color: "#3B82F6" }}
          >
            {value}
          </motion.h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatisticsSection: React.FC = () => {
  return (
    <motion.main
      className="flex flex-wrap gap-8 justify-center mt-14"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {statisticsData.map((stat, index) => (
        <StatisticsCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          description={stat.description}
          iconColor={stat.iconColor}
        />
      ))}
    </motion.main>
  );
};

export default StatisticsSection;