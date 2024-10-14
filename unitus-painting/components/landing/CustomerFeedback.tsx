import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Phone } from "lucide-react";

type TestimonialProps = {
  name: string;
  location: string;
  avatarSrc: string;
  content: string;
};

const Testimonial: React.FC<TestimonialProps> = ({ name, location, avatarSrc, content }) => {
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
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={avatarSrc} alt={`${name}'s avatar`} />
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-blue-950">{name}</h3>
                <p className="text-sm text-zinc-500">{location}</p>
              </div>
            </div>
          </div>
          <p className="text-zinc-700 leading-relaxed">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CustomerFeedback: React.FC = () => {
  const testimonial = {
    name: "Nancy Luther",
    location: "New York",
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ff58155191ecc29c3bdae3c79770d14291662ee44036e102c5629586e66e23a9?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    content: "We have had several good experiences with Blue Collar team. Most recently, they replaced our 20-year-old HVAC system with a new, modern, and more efficient system & it worked fine."
  };

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
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 }
          }}
          transition={{ duration: 0.5, staggerChildren: 0.2 }}
        >
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }} className="space-y-6">
            <Testimonial {...testimonial} />
            <motion.div 
              className="flex gap-4"
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: -20 }
              }}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/d03c5582e3a943fb5ffc8393127d6661bc87e59a268d765f7930fbbabfaf1bd8?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Testimonial image 1" />
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/0b180addfa846bb6a5e0a2f39e401e298a6bfc880f26c6f084d45ffc93a0c45f?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Testimonial image 2" />
              </Avatar>
            </motion.div>
          </motion.div>
          <motion.div
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: 50 }
            }}
            className="bg-amber-400 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-950 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Any Questions?
              </div>
              <h3 className="text-3xl font-bold text-blue-950 mb-4">We're Here to Help</h3>
              <p className="text-blue-950 mb-6">
                Have questions about your painting project? Need a quote or assistance? Our team is ready to provide expert support. Contact us:
              </p>
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-blue-950" />
                </div>
                <span className="text-2xl font-bold text-white">604-357-4787</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerFeedback;