import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const CaulkingDetail: React.FC = () => {
  const serviceData = {
    title: "Caulking",
    description: `Proper caulking is essential for protecting your home or business from moisture, drafts, and damage. Whether you’re dealing with gaps around windows, doors, or deteriorating sealant, our expert team provides professional caulking services to safeguard your property.
Our technicians apply caulking with precision, ensuring every seam is sealed to prevent air and water infiltration. Using high-quality materials like silicone or acrylic caulk, we provide long-lasting protection suited to your specific needs. From interior to exterior surfaces, we tailor our services to your property, whether it's residential or commercial.
Well-sealed joints also improve energy efficiency by blocking drafts and reducing air leaks, helping you lower energy bills and maintain a comfortable indoor environment. We also offer preventative maintenance, inspecting and repairing caulking to protect against future water damage or mold.
Our licensed professionals deliver reliable, high-quality caulking services with a focus on detail and durability. Contact us today to keep your property protected and looking its best.`,
    headerImage: "",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "experience investor Technician." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Your Electrical and Security System." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "sources whereas high standards." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Credibly innovate granular internal." },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "services for domestic and commercial." },
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/7ba997c359c2b35759dfc95996ef77426108472c05a24c487c8ca41d2500d473?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default CaulkingDetail;