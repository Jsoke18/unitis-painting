import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Service = {
  icon: string;
  label: string;
  content: {
    title: string;
    description: string;
    imageSrc: string;
    link: string;
  };
};

const services: Service[] = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f609be6373b67a1e7974196a374686fb06bda7407dbe85f6522226505a64d686?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    label: "COMMERCIAL",
    content: {
      title: "Commercial Services",
      description:
        "At Unitus Painting Ltd, we provide expert commercial painting services to enhance your building's appearance. Whether it's refreshing the exterior, updating interiors, or painting common areas, our skilled team ensures high-quality results that boost your property's aesthetic and professionalism.",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9?apiKey=a05a9fe5da54475091abff9f564d40f8&",
      link: "/services/commercial-services",
    },
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd2445a0273933dddf4aa9d5fad6ff30e1941c1c1713fa460f07ac89658f9cbd?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    label: "STRATA",
    content: {
      title: "Strata Services",
      description:
        "At Unitus Painting Ltd., we offer specialized strata painting services tailored to enhance the appearance and value of your property. Our experienced team delivers professional results, whether you're refreshing exteriors, updating common areas, or maintaining interior spaces. We ensure quality, efficiency, and minimal disruption for residents.",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6e19be2f4a6bd20a168cbe08a71d4f039386e8a6c28ab19994bc52980b28ee59?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
      link: "/services/strata-services",
    },
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6063ad228250655345711f681d6b31e4523ef155d6ed94a7a76a8dd4a1b2ec50?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    label: "RESIDENTIAL",
    content: {
      title: "Residential Services",
      description:
        "Transform your home with Unitus Painting Ltd.'s expert residential painting services. Whether you're refreshing a single room or giving your entire home a makeover, our experienced painters deliver high-quality, long-lasting results. We ensure minimal disruption to your daily life while creating a space that feels fresh and vibrant.",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/c64b6b1d6cc58d0edfa0d126db56a1f66cec314c83bdebac969ba5b68ea80532?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
      link: "/services/residential",
    },
  },
];

const ServiceTab: React.FC<{
  service: Service;
  isActive: boolean;
  onClick: () => void;
}> = ({ service, isActive, onClick }) => {
  const baseClasses =
    "flex gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 border border-solid cursor-pointer transition-all duration-300 ease-in-out w-full sm:w-auto justify-center";
  const activeClasses = isActive
    ? "bg-white border-white"
    : "bg-amber-400 border-blue-950 hover:bg-amber-500";

  return (
    <motion.div
      className={`${baseClasses} ${activeClasses}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        loading="lazy"
        src={service.icon}
        alt=""
        className="object-contain w-5 h-5 sm:w-6 sm:h-6"
      />
      <div className="text-sm sm:text-base font-medium">{service.label}</div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <motion.section
      className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 pt-12 sm:pt-16 md:pt-28 pb-16 sm:pb-20 md:pb-28 w-full bg-amber-400" // Added bottom padding here
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center max-w-6xl w-full">
        <Link href="/services" passHref legacyBehavior>
          <motion.a
            className="flex gap-2 px-4 py-2 text-sm md:text-base font-medium tracking-wide text-center bg-zinc-100 text-blue-950 rounded-full cursor-pointer hover:bg-zinc-200 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fb1571042200156160d3ff53ccaf903449ecdb9924e0162bf226193ecaf3fb8?apiKey=a05a9fe5da54475091abff9f564d40f8&"
              alt=""
              className="object-contain w-4 h-4 sm:w-5 sm:h-5"
            />
            <div>View All Services</div>
          </motion.a>
        </Link>
        <motion.h2
          className="mt-6 md:mt-8 text-xl sm:text-2xl md:text-4xl font-extrabold tracking-wide text-center text-blue-950 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Expert Painting Solutions for Every Space
        </motion.h2>
        <motion.p
          className="mt-4 md:mt-7 text-sm sm:text-base md:text-lg tracking-wide leading-6 sm:leading-7 text-center text-blue-950 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Unitus Painting Ltd offers a wide range of painting services for
          commercial, strata, and residential properties. We are committed to
          delivering professional results while maintaining high standards of
          quality, safety, and efficiency.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mt-6 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {services.map((service) => (
            <ServiceTab
              key={service.label}
              service={service}
              isActive={service.label === activeService.label}
              onClick={() => setActiveService(service)}
            />
          ))}
        </motion.div>
        <motion.div
          className="w-full px-4 sm:px-6 md:px-8 lg:px-16 pt-6 sm:pt-8 md:pt-16 pb-6 sm:pb-8 md:pb-16 mt-6 sm:mt-8 md:mt-14 mb-8 sm:mb-12 md:mb-16 bg-white shadow-lg rounded-lg" // Added margin-bottom here
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-8">
            <div className="flex flex-col justify-between md:w-1/2">
              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={activeService.content.title}
                    className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight text-blue-950"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeService.content.title}
                  </motion.h3>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeService.content.description}
                    className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 text-zinc-500"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {activeService.content.description}
                  </motion.p>
                </AnimatePresence>
              </div>
              <Link href={activeService.content.link} passHref legacyBehavior>
                <motion.a
                  className="px-6 sm:px-8 py-2.5 sm:py-3 mt-4 sm:mt-6 text-base sm:text-lg font-semibold bg-amber-400 text-blue-950 border-2 border-amber-400 rounded-md hover:bg-amber-500 transition-colors duration-300 w-full text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Read More
                </motion.a>
              </Link>
            </div>
            <div className="md:w-1/2 h-48 sm:h-64 md:h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.content.imageSrc}
                  className="w-full h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={activeService.content.imageSrc}
                    alt={`${activeService.label} painting service`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Services;