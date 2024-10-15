import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const InteriorPaintingService: React.FC = () => {
  const serviceData = {
    title: "Interior Painting Services",
    description: `Revitalize your interior spaces with our professional painting services. Whether you're refreshing a single room, updating your entire home, or transforming a commercial space, our experienced team delivers precise, high-quality results.

We begin by thoroughly preparing surfaces, filling holes, sanding, and priming to ensure a smooth finish. Using top-tier, low-VOC paints and specialty coatings, we provide durable, attractive results tailored to your needs. Our color consultants help you choose the perfect shades to complement your style and enhance the atmosphere of your space.

Our painters work efficiently, minimizing disruption while protecting your furniture and leaving your space clean and tidy. Customer satisfaction is our priority, and we're committed to exceeding your expectations with every project.

Contact us today to bring new life to your interiors with our trusted painting services.`,
    headerImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/f49d2137ba497103f5e2d1de944646ea44988b473c6b22bfba7dfaa3369ee32f?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Expert Surface Preparation" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "High-Quality Paint Products" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Custom Color Consultation" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Professional Application" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Minimal Disruption" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Customer Satisfaction" },
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/cce1c4b96ac0f676415058c119d12cd330c42dc8d0312bdac1470e86943780f3?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default InteriorPaintingService;