import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const clients = [
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/0057f7c4d4561963734f5078a3464f4d4f0af798c40d4a924a58b830b4ccfe9d?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Staples" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/23e45d0ae41deb68f3a4886e27af289f43b8a92d7f244d0372457c1157ff9ca2?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Best Buy" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aa19ae66818b5dc74ed754a7bd4356c6e3d9a4131664e24b27c51154ef7e8cb?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Shoppers Drug Mart" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8c6de74e7315654a3462be197bf2fe564cdb8aee213d0ce07eb6d99341b9d59?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Real Canadian Superstore" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3319b354ea81da0086bfd6959b6a3a8ddca4939377fa04e0b036aad4d56216e?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Save On Foods" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a31d639dda1fcd12e87def942d33b49296f0a7062659d83adc2280b32f839258?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Costco" },
  { src: "/photos/bentallgreenoak-logo-vector.png", alt: "BentallGreenOak" },
  { src: "/photos/U-Haul_logo.svg.png", alt: "U-Haul" },
  { src: "/photos/8c06fe178644610f128fd0f4fe9bfee6.png", alt: "Client Logo" },
  { src: "/photos/991f54639ff69806a441ffc039296a53.webp", alt: "Client Logo" },
  { src: "/photos/Four-Seasons-Logo.png", alt: "Four Seasons" },
  { src: "/photos/home-depot.png", alt: "Home Depot" },
  { src: "/photos/Honda-logo-1920x1080.webp", alt: "Honda" },
  { src: "/photos/Houle_Electric.jpg", alt: "Houle Electric" },
  { src: "/photos/icbc.png", alt: "ICBC" },
  { src: "/photos/images (1).png", alt: "Client Logo" },
  { src: "/photos/images.jpg", alt: "Client Logo" },
  { src: "/photos/images.png", alt: "Client Logo" },
  { src: "/photos/loblaws.png", alt: "Loblaws" },
  { src: "/photos/Public_Storage_Logo.svg.png", alt: "Public Storage" },
  { src: "/photos/Rancho-Management.png", alt: "Rancho Management" },
];

const NotableClients: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const updateWidth = () => {
      const logoWidth = 192; // 48px * 4 (w-48)
      const gap = 32; // 8px * 4 (space-x-8)
      setContainerWidth((logoWidth + gap) * clients.length);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className="mt-10 py-16 mb-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-center text-blue-950 mb-32"
        >
          Notable Clients
        </motion.h2>
        <motion.div
          variants={itemVariants}
          className="relative h-32 overflow-hidden"
        >
          <motion.div
            animate={{
              x: [-containerWidth, -containerWidth * 2],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            className="flex space-x-8 absolute"
            style={{ width: `${containerWidth * 3}px` }}
          >
            {[...clients, ...clients, ...clients].map((client, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 flex items-center justify-center w-48 h-32 bg-white rounded-lg shadow-sm p-4"
              >
                <img
                  src={client.src}
                  alt={client.alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default NotableClients;