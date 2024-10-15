import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, PaintBucket } from 'lucide-react';

interface ExpertiseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ title, description, imageSrc, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-64">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white rounded-full p-2">
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <a href="#" className="text-[#1C2752] hover:text-[#FFB342] transition-colors duration-300 font-semibold flex items-center">
          Learn More
          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

const AreasOfExpertise: React.FC = () => {
  const expertiseAreas = [
    {
      title: 'Residential Building Services',
      description: 'Quality painting and repairs for homes and apartments. Revitalize your living space with expert care.',
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9?apiKey=a05a9fe5da54475091abff9f564d40f8&",
      icon: <Home className="w-6 h-6 text-[#1C2752]" />
    },
    {
      title: 'Strata & Condo Services',
      description: 'Various services for multi-unit residential complexes. Enhancing your property\'s value and appeal.',
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6e19be2f4a6bd20a168cbe08a71d4f039386e8a6c28ab19994bc52980b28ee59?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
      icon: <Building2 className="w-6 h-6 text-[#1C2752]" />
    },
    {
      title: 'Commercial Painting Services',
      description: 'Professional painting solutions for businesses and commercial properties. Enhance your brand image.',
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/c64b6b1d6cc58d0edfa0d126db56a1f66cec314c83bdebac969ba5b68ea80532?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
      icon: <PaintBucket className="w-6 h-6 text-[#1C2752]" />
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="py-16 bg-white"
    >
      <div className="container mx-auto px-4">
        <motion.a
          href="#areas-of-expertise"
          variants={itemVariants}
          className="block text-4xl font-bold mb-12 text-center mt-36 text-[#1C2752] hover:text-[#FFB342] transition-colors duration-300"
        >
          Areas Of Expertise
        </motion.a>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {expertiseAreas.map((area, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ExpertiseCard {...area} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AreasOfExpertise;