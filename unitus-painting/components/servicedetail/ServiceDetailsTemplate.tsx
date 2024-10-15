import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: string;
  text: string;
}

interface ServiceDetailTemplateProps {
  title: string;
  description: string;
  headerImage: string;
  features: Feature[];
  serviceImage: string;
}

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
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
const ServiceDetailTemplate: React.FC<ServiceDetailTemplateProps> = ({
  title,
  description,
  headerImage,
  features,
  serviceImage,
}) => {
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };
  return (
    <main className="flex flex-col items-center w-full bg-white">
      {/* Header */}
      <header className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={headerImage}
          alt={`${title} background`}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-blue-950 bg-opacity-60 flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white text-center px-4">
            {title}
          </h1>
        </div>
      </header>

      {/* About Section */}
      <AnimatedSection>
        <section className="flex flex-col items-center mt-16 px-4 max-w-4xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-blue-950 mb-6"
          >
            About Our Service
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-700 leading-relaxed"
          >
            {description}
          </motion.p>
        </section>
      </AnimatedSection>

      {/* Service Features */}
      <AnimatedSection>
        <section className="mt-16 px-4 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card>
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
            <motion.div variants={itemVariants} className="mt-8 md:mt-0 flex items-center">
              <img
                src={serviceImage}
                alt={`${title} example`}
                className="w-full h-full object-cover rounded-lg shadow-lg"
                style={{ minHeight: '400px' }}
              />
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Call to Action */}
      <section className="w-full bg-amber-400 py-6 mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-center space-x-4">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-blue-950"
            >
              Ready to get started?
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div variants={buttonVariants}>
                <Button
                  size="default"
                  className="bg-white text-blue-950 hover:bg-gray-100 transition-colors duration-200"
                >
                  Get a Quote
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dark blue footer strip */}
      <div className="w-full bg-blue-950 h-4"></div>
    </main>
  );
};

export default ServiceDetailTemplate;