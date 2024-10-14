import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const clients = [
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/0057f7c4d4561963734f5078a3464f4d4f0af798c40d4a924a58b830b4ccfe9d?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 1" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/23e45d0ae41deb68f3a4886e27af289f43b8a92d7f244d0372457c1157ff9ca2?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 2" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aa19ae66818b5dc74ed754a7bd4356c6e3d9a4131664e24b27c51154ef7e8cb?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 3" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8c6de74e7315654a3462be197bf2fe564cdb8aee213d0ce07eb6d99341b9d59?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 4" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3319b354ea81da0086bfd6959b6a3a8ddca4939377fa04e0b036aad4d56216e?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 5" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a31d639dda1fcd12e87def942d33b49296f0a7062659d83adc2280b32f839258?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 6" },
  // Placeholder clients
  { src: "/api/placeholder/200/100", alt: "Placeholder Client 1" },
  { src: "/api/placeholder/200/100", alt: "Placeholder Client 2" },
  { src: "/api/placeholder/200/100", alt: "Placeholder Client 3" },
  { src: "/api/placeholder/200/100", alt: "Placeholder Client 4" },
];

const NotableClients: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Double the client list to create a seamless loop
  const doubledClients = [...clients, ...clients];

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
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-center text-blue-950 mb-12"
        >
          Notable Clients
        </motion.h2>
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <motion.div
            animate={{ x: "-100%" }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex space-x-8 absolute"
          >
            {doubledClients.map((client, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex-shrink-0 flex items-center justify-center w-40 h-24 bg-white rounded-lg shadow-sm"
              >
                <img
                  src={client.src}
                  alt={client.alt}
                  className="max-w-full max-h-16 object-contain"
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