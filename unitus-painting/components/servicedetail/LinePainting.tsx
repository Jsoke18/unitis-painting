import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const LinePaintingDetails: React.FC = () => {
  const serviceData = {
    title: "Line Painting",
    description: `Ensure your parking lot is safe, organized, and professional with our expert line painting services. Using high-quality paints and advanced equipment, we deliver crisp, clear markings that are easy to see and built to last. Whether you need standard parking spaces, directional arrows, or custom designs, we provide precise, reliable results tailored to your needs.
Safety is a top priority, and we offer a variety of safety markings such as fire lanes, crosswalks, stop bars, and pedestrian walkways to promote safe traffic flow and prevent accidents. Our durable paint formulations are designed to withstand heavy traffic and harsh weather conditions, providing long-lasting results with minimal maintenance.
Every parking lot has unique requirements, and we work with you to customize your markings, including specific colors, logos, or signage that reflect your brand and enhance the overall look of your facility. We also offer flexible scheduling to minimize disruption, with options for evenings, weekends, or off-peak hours.`,
    headerImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/3a3c0c47393a76b9a672c7f99cca7e1c14ef80b1f97f0f1c8486768771485603?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Crisp and Clear Lines" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Safety Markings" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Durability" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Customization" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Flexible Scheduling" },
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/5483508ac54ca25547446c51ea8a4e22e6853dec4bdfdcc23a05082d47d750fe?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default LinePaintingDetails;