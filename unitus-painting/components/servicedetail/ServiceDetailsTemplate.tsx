'use client'
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuoteRequestDialog from "@/components/landing/QuoteRequestDialog";

// Types
interface Feature {
  icon: string;
  text: string;
}

interface ServiceDetailTemplateProps {
  title: string;
  description: string;
  videoUrl: string;
  features: Feature[];
  serviceImage: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const buttonHover = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// Animated Section Component
const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Hero Section Component
const HeroSection: React.FC<{ title: string; videoUrl: string }> = ({ title, videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const generateBackground = () => (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              white,
              white 1px,
              transparent 1px,
              transparent 20px
            )`
          }}
        />
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
          }}
        />
      </div>
    </div>
  );

  return (
    <header className="relative w-full h-[80vh] overflow-hidden">
      {videoUrl ? (
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          autoPlay 
          muted={isMuted}
          loop 
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : generateBackground()}

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative text-center w-full max-w-4xl mx-auto"
        >
          <div className="relative px-8 py-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            
            <div className="relative z-10">
              <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">
                {title}
              </h1>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">
                Transform your property with our professional painting services
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <QuoteRequestDialog 
                  buttonClassName="bg-amber-400 text-blue-950 hover:bg-amber-500 transition-colors duration-300 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl font-semibold"
                  buttonContent="Get Free Quote"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {videoUrl && (
        <div className="absolute bottom-8 right-8 flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 transition-colors duration-200"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 transition-colors duration-200"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
        </div>
      )}
    </header>
  );
};

// Features Section Component
const FeaturesSection: React.FC<{ features: Feature[]; serviceImage: string }> = ({ 
  features, 
  serviceImage 
}) => {
  return (
    <section className="mt-16 px-4 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="flex items-center p-4">
                  <img
                    src={feature.icon}
                    alt=""
                    className="w-10 h-10 mr-4"
                  />
                  <p className="text-lg text-blue-950">{feature.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div 
          variants={fadeInUp} 
          className="mt-8 md:mt-0 flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={serviceImage}
            alt="Service example"
            className="w-full h-full object-cover rounded-lg shadow-lg"
            style={{ minHeight: '400px' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

// Call to Action Section Component
const CallToAction: React.FC = () => {
  return (
    <section className="w-full bg-amber-400 py-6 mt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <motion.h2
            variants={fadeInUp}
            className="text-2xl font-bold text-blue-950 text-center md:text-left"
          >
            Ready to transform your property?
          </motion.h2>
          <motion.div 
            variants={fadeInUp}
            whileHover="hover"
          >
            <motion.div variants={buttonHover}>
              <QuoteRequestDialog
                buttonClassName="bg-white text-blue-950 hover:bg-gray-100 transition-colors duration-200 px-8 py-3 rounded-md font-medium shadow-lg"
                buttonContent="Get a Quote"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main Service Detail Template Component
const ServiceDetailTemplate: React.FC<ServiceDetailTemplateProps> = ({
  title,
  description,
  videoUrl,
  features,
  serviceImage,
}) => {
  return (
    <main className="flex flex-col items-center w-full bg-white">
      <HeroSection title={title} videoUrl={videoUrl} />

      <AnimatedSection>
        <section className="flex flex-col items-center mt-16 px-4 max-w-4xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-blue-950 mb-6"
          >
            About Our Service
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {description}
          </motion.p>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <FeaturesSection features={features} serviceImage={serviceImage} />
      </AnimatedSection>

      <CallToAction />

      <div className="w-full bg-blue-950 h-4"></div>
    </main>
  );
};

export default ServiceDetailTemplate;