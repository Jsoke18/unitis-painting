import React from 'react';

interface PageHeaderProps {
  title: string;
  backgroundImageSrc: string;
}

const ServicesPage: React.FC = () => {
  return (
    <main className="flex flex-col text-6xl font-extrabold tracking-wider leading-tight text-center text-white max-md:text-4xl">
      <PageHeader
        title="Our Services"
        backgroundImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/f28e1b37228e8ea5728b3fb2b09487e8a82965eaea67e7de42de8b4923c24dd6?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
      />
    </main>
  );
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, backgroundImageSrc }) => {
  return (
    <header className="flex relative flex-col min-h-[617px] max-md:max-w-full max-md:text-4xl">
      <img 
        loading="lazy" 
        src={backgroundImageSrc} 
        alt={title} 
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <h1>{title}</h1>
      </div>
    </header>
  );
};

export default ServicesPage;
