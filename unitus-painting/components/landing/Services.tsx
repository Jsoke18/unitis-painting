import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Service = {
  icon: string;
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
};

const services: Service[] = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f609be6373b67a1e7974196a374686fb06bda7407dbe85f6522226505a64d686?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    label: "COMMERCIAL",
    title: "Commercial Services",
    description: "At Unitus Painting Ltd, we provide expert commercial painting services to enhance your building's appearance. Whether it's refreshing the exterior, updating interiors, or painting common areas, our skilled team ensures high-quality results that boost your property's aesthetic and professionalism.",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    link: "/services/commercial-services",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd2445a0273933dddf4aa9d5fad6ff30e1941c1c1713fa460f07ac89658f9cbd?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    label: "STRATA",
    title: "Strata Services",
    description: "At Unitus Painting Ltd., we offer specialized strata painting services tailored to enhance the appearance and value of your property. Our experienced team delivers professional results, whether you're refreshing exteriors, updating common areas, or maintaining interior spaces.",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6e19be2f4a6bd20a168cbe08a71d4f039386e8a6c28ab19994bc52980b28ee59?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/services/strata-services",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6063ad228250655345711f681d6b31e4523ef155d6ed94a7a76a8dd4a1b2ec50?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    label: "RESIDENTIAL",
    title: "Residential Services",
    description: "Transform your home with Unitus Painting Ltd.'s expert residential painting services. Whether you're refreshing a single room or giving your entire home a makeover, our experienced painters deliver high-quality, long-lasting results while ensuring minimal disruption to your daily life.",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/c64b6b1d6cc58d0edfa0d126db56a1f66cec314c83bdebac969ba5b68ea80532?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/services/residential",
  },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    <motion.div 
      className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-40 sm:h-48">
        <img
          src={service.imageSrc}
          alt={`${service.label} painting service`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={service.icon}
            alt=""
            className="w-5 h-5 object-contain"
          />
          <div className="font-medium text-blue-950 text-sm">{service.label}</div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-blue-950 mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-zinc-500 mb-4 flex-grow line-clamp-4">
          {service.description}
        </p>
        <Link href={service.link} passHref legacyBehavior>
          <motion.a
            className="px-4 py-2 text-sm font-semibold bg-amber-400 text-blue-950 rounded-md hover:bg-amber-500 transition-colors duration-300 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Read More
          </motion.a>
        </Link>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  return (
    <motion.section
      className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 w-full bg-amber-400"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center max-w-6xl w-full">
        <Link href="/services" passHref legacyBehavior>
          <motion.a
            className="flex gap-2 px-4 py-2 text-sm font-medium tracking-wide text-center bg-zinc-100 text-blue-950 rounded-full cursor-pointer hover:bg-zinc-200 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fb1571042200156160d3ff53ccaf903449ecdb9924e0162bf226193ecaf3fb8?apiKey=a05a9fe5da54475091abff9f564d40f8&"
              alt=""
              className="object-contain w-4 h-4"
            />
            <div>View All Services</div>
          </motion.a>
        </Link>
        <motion.h2
          className="mt-4 md:mt-6 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-center text-blue-950 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Expert Painting Solutions for Every Space
        </motion.h2>
        <motion.p
          className="mt-3 md:mt-4 text-sm sm:text-base tracking-wide leading-6 text-center text-blue-950 px-2 mb-6 md:mb-8"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {services.map((service) => (
            <ServiceCard key={service.label} service={service} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Services;