import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

const statisticsData = [
  {
    iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ce744f7b1915ee43055d209bb2d870b600134d0e474044b0e06daaf5cb674b6e?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    value: "4,500+",
    description: "Projects Completed"
  },
  {
    iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d233d8c5c0ca7f869104f6f83faddba6df0f18e3d50de59f0649845f8af5c911?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    value: "1000+",
    description: "Happy Customers"
  },
  {
    iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/4534f8e113adbc1937b916b2ae6d423e9a7401769b624ee8246336f159935805?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    value: "5/5",
    description: "Better Business Bureau® Rating"
  }
];

const StatisticsCard: React.FC<{
  iconSrc: string;
  value: string;
  description: string;
}> = ({ iconSrc, value, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="w-64 h-64 flex flex-col items-center justify-between p-6">
        <img src={iconSrc} alt="" className="w-16 h-16 mb-4" />
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
          iconSrc={stat.iconSrc}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </motion.main>
  );
};

export default StatisticsSection;