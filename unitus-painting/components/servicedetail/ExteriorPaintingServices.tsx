import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const ExteriorPaintingService: React.FC = () => {
  const serviceData = {
    title: "Exterior Painting Services",
    description: `Improve the look and protection of your property with our exterior painting services. Whether you're refreshing your home's exterior, reviving worn siding, or updating a larger commercial or industrial building, our skilled painters provide lasting, high-quality results.

    We start with thorough surface preparation, cleaning, sanding, and priming to ensure the best paint adhesion. Using top-quality, weather-resistant paints, we protect your property from moisture, UV rays, and other environmental factors. Our color consultants work with you to choose the perfect shades, and our professional application ensures a smooth, flawless finish every time.

    With a focus on efficiency, we complete projects on time with minimal disruption to your routine. Contact us today to enhance your property's appearance and durability with our reliable exterior painting services.`,
    headerImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/46bb151e5edeebbad62f39c28c06466c79b9b95212ba1d34a69c59dda16fc919?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Enhance the curb appeal" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Expert Surface Preparation" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "High-Quality Paint Products" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Custom Color Consultation" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Professional Application" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Weather Protection" },
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/11baeefb553c242b3b6b9424bad23887eb9b3e30553ba0020da47cf743a557a6?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default ExteriorPaintingService;