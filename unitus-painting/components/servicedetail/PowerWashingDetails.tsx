import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const PowerWashingDetails: React.FC = () => {
  const serviceData = {
    title: "Power Washing",
    description: `Restore the look of your home or business with our professional power washing services. We remove dirt, grime, mold, and mildew from surfaces like siding, driveways, sidewalks, and decks using advanced equipment that delivers powerful cleaning while protecting delicate areas. Our technicians are trained to adjust pressure settings, ensuring a thorough clean without damaging your property.
We provide customized solutions to meet your needs, whether it's a one-time deep cleaning or ongoing maintenance. Using eco-friendly cleaning products and methods, we deliver exceptional results with minimal environmental impact. A clean exterior enhances curb appeal and property value, making your space more inviting and well-maintained.
With licensed and insured technicians, you can trust us to offer reliable, efficient service every time. Contact us today to schedule your power washing and bring new life to your property.`,
    headerImage: "",
    features: [
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Effective Cleaning" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Gentle Treatment" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Customized Solutions:" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Environmentally Friendly" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Enhanced Curb Appeal" },
      { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Licensed and Insured" },
    ],
    serviceImage: "",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default PowerWashingDetails;