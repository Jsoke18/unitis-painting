import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const CabinetPaintingDetails: React.FC = () => {
  const serviceData = {
    title: "Cabinet Painting",
    description: `Transform your kitchen or bathroom with our professional cabinet painting services. We begin with thorough surface preparation, cleaning and sanding your cabinets to ensure a smooth and durable finish. Using premium-quality paints and finishes, we offer a variety of options, from sleek matte to satin sheen, to match your style.
Our custom color matching ensures your cabinets blend seamlessly with your decor. With expert application techniques, we guarantee flawless, even coverage that’s free of brush strokes and drips. We also apply protective sealants to safeguard against moisture, stains, and daily wear, ensuring long-lasting beauty.
Our team works efficiently to minimize disruption, so you can enjoy your updated cabinets quickly. Contact us today to schedule a consultation and bring new life to your space with our cabinet painting services.`,
    headerImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/b1248da9f804d902b1dbb93e59e63452669265f0438b1f0f2a557ea8e83eea26?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Expert Surface Preparation" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Premium Paint Products" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Custom Color Matching" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Durable Finish" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Convenient Service" },
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/94b1b1b399bb08ced1498daaebfa562ef5fa2be29eca19445b7cd2f3731f495d?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default CabinetPaintingDetails;