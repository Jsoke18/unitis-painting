import React from 'react';
import StatisticsCard from './StatisticsCard';

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

const StatisticsSection: React.FC = () => {
  return (
    <main className="flex flex-wrap gap-8 justify-center mt-14">
      {statisticsData.map((stat, index) => (
        <StatisticsCard
          key={index}
          iconSrc={stat.iconSrc}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </main>
  );
};

export default StatisticsSection;