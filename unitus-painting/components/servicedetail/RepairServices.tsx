import React from 'react';
import ServiceDetailTemplate from './ServiceDetailsTemplate';

const RepairsService: React.FC = () => {
  const serviceData = {
    title: "Repairs",
    description: `At Unitus Painting, we are dedicated to providing reliable, high-quality repair services that restore the functionality and comfort of your property. Let us help you keep your home or business in top condition!`,
    headerImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/f49d2137ba497103f5e2d1de944646ea44988b473c6b22bfba7dfaa3369ee32f?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    features: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
        text: "Comprehensive Repairs",
        description: "From carpentry to drywall repairs, we offer a wide range of repair services to address many of the problems that may be affecting your home or business. Our experienced technicians have the knowledge and expertise to diagnose issues accurately and provide lasting solutions."
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
        text: "Prompt Response",
        description: "We understand that unexpected repairs can disrupt your daily routine and cause inconvenience. That's why we prioritize prompt response times and strive to address repair requests as quickly as possible. Whether it's a leaky faucet, a faulty electrical outlet, or a damaged roof, you can count on us to resolve the issue promptly and efficiently."
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
        text: "Quality Workmanship",
        description: "Our team takes pride in delivering quality workmanship on every repair project we undertake. Whether we're patching drywall, replacing a broken window, or fixing a malfunctioning appliance, we use high-quality materials and proven techniques to ensure durable, long-lasting results."
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
        text: "Transparent Communication",
        description: "We believe in transparent communication throughout the repair process. From providing accurate cost estimates upfront to keeping you informed of progress every step of the way, we strive to ensure that you have a clear understanding of the work being done and the timeline involved."
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
        text: "Customer Satisfaction",
        description: "Your satisfaction is our top priority. We go above and beyond to ensure that your repair needs are met with professionalism, courtesy, and attention to detail. Whether it's a small repair job or a larger renovation project, we are committed to exceeding your expectations and earning your trust."
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
        text: "Licensed and Insured",
        description: "Rest assured that your property is in capable hands with our team of licensed and insured technicians. We adhere to industry standards and regulations, prioritizing safety and compliance in every aspect of our work."
      }
    ],
    serviceImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/cce1c4b96ac0f676415058c119d12cd330c42dc8d0312bdac1470e86943780f3?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
  };

  return <ServiceDetailTemplate {...serviceData} />;
};

export default RepairsService;