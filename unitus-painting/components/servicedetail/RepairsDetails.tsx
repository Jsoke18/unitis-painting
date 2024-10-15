import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const BlankServiceTemplate: React.FC = () => {
  const serviceData = {
    title: "Repairs",
    description: ``,
    headerImage: "",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "services for domestic and commercial." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Credibly innovate granular internal." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "sources whereas high standards." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Your Electrical and Security System." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Experience investor Technician." },
    ],
    serviceImage: "",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default BlankServiceTemplate;