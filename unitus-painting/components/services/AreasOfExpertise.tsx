import React from 'react';
import { motion } from 'framer-motion'; // For Framer Motion animations

interface ExpertiseCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ title, description, imageSrc }) => {
  return (
    <motion.article
      className="flex flex-col w-[30%] bg-white p-6 shadow-lg rounded-lg max-md:w-full"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img src={imageSrc} alt={title} className="object-cover h-48 w-full rounded-md" />
      <h3 className="mt-6 text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-700 text-lg">{description}</p>
      <LearnMoreButton />
    </motion.article>
  );
};

const LearnMoreButton: React.FC = () => {
  return (
    <div className="flex items-center mt-6">
      <button className="text-blue-600 font-semibold text-lg">Learn More</button>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f4b1aa9e8335d137d2e4335a8130af4a737c03a66813960207998d1acef2fda?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
        alt=""
        className="object-contain w-8 h-8 ml-2"
      />
    </div>
  );
};

const AreasOfExpertise: React.FC = () => {
  const expertiseAreas = [
    { id: 1, title: 'Residential Building Services', description: 'Quality painting and repairs for homes and apartments. Revitalize your living space with expert care.', imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9?apiKey=a05a9fe5da54475091abff9f564d40f8&" },
    { id: 2, title: 'Strata & Condo Services', description: 'Various services for multi-unit residential complexes. Enhancing your propertys value and appeal.', imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6e19be2f4a6bd20a168cbe08a71d4f039386e8a6c28ab19994bc52980b28ee59?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"},
    { id: 3, title: 'Residential Building Services', description: 'Quality painting and repairs for homes and apartments. Revitalize your living space with expert care.', imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/c64b6b1d6cc58d0edfa0d126db56a1f66cec314c83bdebac969ba5b68ea80532?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8" },
  ];

  return (
    <section className="flex flex-col items-center justify-center mt-20">
      <h2 className="text-4xl font-bold mb-10">Our Expertise Areas</h2>
      <div className="flex justify-between gap-8 w-full max-w-screen-lg">
        {expertiseAreas.map((area) => (
          <ExpertiseCard key={area.id} title={area.title} description={area.description} imageSrc={area.imageSrc} />
        ))}
      </div>
    </section>
  );
};

export default AreasOfExpertise;
