import React from 'react';

interface FeatureProps {
  icon: string;
  text: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, text }) => (
  <div className="flex gap-2.5 mt-11 max-md:mt-10">
    <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 w-8 aspect-square" />
    <div className="grow shrink basis-auto">{text}</div>
  </div>
);

const ServiceFeatures: React.FC = () => {
  const features = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Enhance the curb appeal" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Expert Surface Preparation" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "High-Quality Paint Products" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Custom Color Consultation" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Professional Application" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/625ad905dffef56d9ab7bda7c135f4537a800c412ea8b79ccfe8b5cc3a764fe0?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "Weather Protection" },
  ];

  return (
    <section className="self-center mt-8 max-w-full w-[867px]">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-[41%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full text-lg font-medium tracking-wide text-blue-950 max-md:mt-10">
            {features.map((feature, index) => (
              <Feature key={index} icon={feature.icon} text={feature.text} />
            ))}
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[59%] max-md:ml-0 max-md:w-full">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/11baeefb553c242b3b6b9424bad23887eb9b3e30553ba0020da47cf743a557a6?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8" alt="Exterior painting service example" className="object-contain w-full aspect-[1.09] max-md:mt-10 max-md:max-w-full" />
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;