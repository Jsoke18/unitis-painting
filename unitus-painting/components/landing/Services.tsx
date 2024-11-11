'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ServicesContent, defaultServicesContent, Service } from '@/app/types/services';
import { Skeleton } from 'antd';

const ServiceCard = React.memo<{ service: Service }>(({ service }) => {
  return (
    <motion.div 
      className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-40 sm:h-48">
        <Image
          src={service.imageSrc}
          alt={`${service.label} painting service`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-5 h-5">
            <Image
              src={service.icon}
              alt=""
              fill
              sizes="20px"
              className="object-contain"
              loading="lazy"
            />
          </div>
          <div className="font-medium text-blue-950 text-sm">{service.label}</div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-blue-950 mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-zinc-500 mb-4 flex-grow line-clamp-4">
          {service.description}
        </p>
        <Link 
          href={service.link}
          className="px-4 py-2 text-sm font-semibold bg-amber-400 text-blue-950 rounded-md hover:bg-amber-500 transition-colors duration-300 text-center hover:scale-102 active:scale-98"
        >
          Read More
        </Link>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const ServicesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
    {[1, 2, 3].map((key) => (
      <div key={key} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Skeleton.Image className="w-full h-48" active />
        <div className="p-4">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    ))}
  </div>
);

// SVG Paint Roller icon as a component
const PaintRollerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z"/>
    <path d="M16 7H8C7.45 7 7 7.45 7 8V11C7 11.55 7.45 12 8 12H16C16.55 12 17 11.55 17 11V8C17 7.45 16.55 7 16 7ZM15 10H9V9H15V10Z"/>
    <path d="M12 14H8C7.45 14 7 14.45 7 15C7 15.55 7.45 16 8 16H12C12.55 16 13 15.55 13 15C13 14.45 12.55 14 12 14Z"/>
  </svg>
);

const Services: React.FC = () => {
  const [content, setContent] = useState<ServicesContent>(defaultServicesContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching services content:', error);
        setError('Failed to load services content');
        setContent(defaultServicesContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <motion.section
      className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 w-full bg-amber-400"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {error && (
        <div className="w-full max-w-6xl mb-4">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/services" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide text-center bg-zinc-100 text-blue-950 rounded-full cursor-pointer hover:bg-zinc-200 transition-colors duration-300 hover:scale-105 active:scale-95">
            <PaintRollerIcon />
            <span>View All Services</span>
          </Link>
        </motion.div>

        <motion.h2
          className="mt-4 md:mt-6 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-center text-blue-950 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {content.heading}
        </motion.h2>

        <motion.p
          className="mt-3 md:mt-4 text-sm sm:text-base tracking-wide leading-6 text-center text-blue-950 px-2 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {content.description}
        </motion.p>

        {isLoading ? (
          <ServicesSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {content.services.map((service) => (
              <ServiceCard key={service.label} service={service} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default React.memo(Services);