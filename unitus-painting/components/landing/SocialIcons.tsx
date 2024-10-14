import React from 'react';

const SocialIcons: React.FC = () => {
  const icons = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/88b9a00e77573038c2fe9dd0a7db11b598381f5f8a67b4b0cb60cabac8a0ea98?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Social media icon 1" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/803bef6e56764136997c5fb77255f7a82b756d6f877995cea27b48ad98cfaa26?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Social media icon 2" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7faa6e2d1fdcd68c127ed6597c289825cbf2107d968c0f0f8b14c927c96777ed?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Social media icon 3" }
  ];

  return (
    <div className="flex">
      {icons.map((icon, index) => (
        <img key={index} loading="lazy" src={icon.src} alt={icon.alt} className="object-contain shrink-0 aspect-[1.34] w-[39px]" />
      ))}
    </div>
  );
};

export default SocialIcons;