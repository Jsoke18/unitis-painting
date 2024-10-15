import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const CarpentryDetails: React.FC = () => {
  const serviceData = {
    title: "Carpentry",
    description: `Enhance the beauty and functionality of your property with our expert carpentry services. Whether you need custom woodwork, structural repairs, or exterior improvements, our skilled carpenters are ready to deliver high-quality results that bring your vision to life.
We specialize in creating custom woodwork, including trim, molding, cabinetry, and shelving, designed to match your style and elevate your space. Our team also excels in structural repairs, using durable materials to fix rotted wood, termite damage, or other issues, ensuring long-lasting stability.
For interior renovations, we handle everything from baseboards and crown moldings to complex projects that transform your space. We also offer exterior carpentry services, building decks, pergolas, and repairing siding to improve curb appeal and value. All projects are completed with weather-resistant materials and expert craftsmanship to withstand the elements.
Every project receives personalized attention, and our licensed, insured team works to ensure your satisfaction with safe, efficient service. Contact us today to discuss how our carpentry services can enhance your home or business with exceptional craftsmanship.`,
    headerImage: "",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Custom Woodwork" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Structural Repairs" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Interior Renovations" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Exterior Enhancements" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Attention to Detail" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Licensed and Insured" },
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/a56c40703cf002983f06b0d012adcc2c74f32bfda1da374dc475c16cbd8d344d?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default CarpentryDetails;