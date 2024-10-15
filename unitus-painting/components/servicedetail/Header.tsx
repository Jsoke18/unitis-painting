import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex relative flex-col w-full min-h-[440px] max-md:max-w-full">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/46bb151e5edeebbad62f39c28c06466c79b9b95212ba1d34a69c59dda16fc919?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8" alt="Exterior painting service background" className="object-cover absolute inset-0 size-full" />
      <div className="flex relative w-full bg-blue-950 bg-opacity-80 min-h-[440px] max-md:max-w-full" />
    </header>
  );
};

export default Header;