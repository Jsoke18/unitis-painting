import React from 'react';

interface PageHeaderProps {
  title: string;
  backgroundImageSrc: string;
}

const ServicesPage: React.FC = () => {
  return (
    <main className="flex flex-col text-center text-white">
      <PageHeader
        title="Our Services"
        backgroundImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/188256efd1fb49af755bc5633348461fe3fa53373c0cacee5a565376fb4be2f2?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
      />
    </main>
  );
};

const Hero: React.FC<PageHeaderProps> = ({ title, backgroundImageSrc }) => {
  return (
    <header className="relative flex flex-col min-h-[617px] max-md:text-4xl">
      <img
        loading="lazy"
        src={backgroundImageSrc}
        alt={title}
        className="absolute inset-0 object-cover w-full h-full"
      />
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
      <div className="relative z-10 flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-6xl font-extrabold tracking-wider leading-tight max-md:text-4xl">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Hero;
