import React from 'react';
import { User, Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ExpertData {
  name: string;
  role: string;
  imageSrc: string;
  link: string;
}


const expertsData: ExpertData[] = [
  {
    name: "Bryce Cayer",
    role: "Founder, CEO & Senior Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/cf72a73794addb48e118d48ed8fd9df05d23efc742a83b6c00432f6a380ab7be?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/bryce-cayer"
  },
  {
    name: "Chris Mitchell",
    role: "Founder, CFO & Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/527eb9fd150b2dc616b08704dd770335f6b0468c0406969ed0844a3022c06913?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/chris-mitchell"
  },
  {
    name: "Keith Yung",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aaa37d679a479b152a382a5b4fc557b7f357085d15234b44c323d8a7f6e5300?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/keith-yung"
  },
  {
    name: "Colin Atkinson",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/bca02830c6de5692db82cdcd1537747f9818df9eca024a115cca1a7ff0eb2f4e?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/colin-atkinson"
  },
  {
    name: "Kyle Rooney",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/765e8b96e602ceb349572b150a35fec30f2ac8ecd359320856f421735adbd718?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/kyle-rooney"
  },
  {
    name: "Tony Balazs",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/3da8d9d953149e442f735f85f3a2f8f359fcf9d934895b7bc78df1dc21125129?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/tony-balazs"
  },
  {
    name: "Michael Powell",
    role: "Client Relations",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/1614588dec73992d594aa34099aaf2a59503d4115a4d534b76fd10e1f9f0d194?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/michael-powell"
  }
];


const VideoSection: React.FC = () => (
  <motion.div 
    className="relative w-full max-w-5xl mx-auto mb-20"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.8,
      ease: [0.17, 0.55, 0.55, 1]
    }}
  >
    <div className="relative pb-[56.25%] rounded-xl overflow-hidden shadow-2xl">
      <iframe
        src="https://player.vimeo.com/video/1025605551?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
    <motion.div 
      className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />
  </motion.div>
);

const ExpertCard: React.FC<ExpertData & { index: number }> = ({ name, role, imageSrc, link, index }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 w-full max-w-sm"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div className="aspect-w-4 aspect-h-3 overflow-hidden">
        <motion.img 
          src={imageSrc} 
          alt={name} 
          className="object-cover w-full h-full"
          variants={imageVariants}
        />
      </motion.div>
      <div className="p-6">
        <Link href={link} className="block relative">
          <motion.div 
            className="relative z-10"
            initial={{ color: '#1e3a8a' }} // text-blue-900
            whileHover={{ 
              color: '#2563eb', // text-blue-600
              transition: { duration: 0.2 }
            }}
          >
            <span className="text-xl font-semibold block transform-gpu">
              {name}
            </span>
          </motion.div>
        </Link>
        <motion.p 
          className="text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          {role}
        </motion.p>
      </div>
    </motion.div>
  );
};

const ExpertTeam: React.FC = () => {
  const itemsPerRow = 3;
  const totalItems = expertsData.length;
  const fullRows = Math.floor(totalItems / itemsPerRow);
  const lastRowItems = totalItems % itemsPerRow;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 md:px-8 lg:px-16">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
        >
          <motion.div 
            className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Watch Our Story</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight"
            variants={headerVariants}
          >
            The People Behind Our Success
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
            variants={headerVariants}
          >
            Get to know our team and see how we work together to deliver exceptional results for our clients.
          </motion.p>
          
          <VideoSection />
        </motion.div>

        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
        >
          <motion.div 
            className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Our Team</span>
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 leading-tight"
            variants={headerVariants}
          >
            Meet Our Experts
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={headerVariants}
          >
            Our people are fully qualified with all types of services whether it's commercial, residential, or industrial. You'll get top-notch service every time.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertsData.slice(0, fullRows * itemsPerRow).map((expert, index) => (
            <ExpertCard key={index} {...expert} index={index} />
          ))}
        </div>
        
        {lastRowItems > 0 && (
          <div className={`flex justify-center mt-8 gap-8 ${lastRowItems === 1 ? 'md:justify-center' : 'md:justify-start'}`}>
            {expertsData.slice(fullRows * itemsPerRow).map((expert, index) => (
              <ExpertCard 
                key={fullRows * itemsPerRow + index} 
                {...expert} 
                index={fullRows * itemsPerRow + index}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ExpertTeam;