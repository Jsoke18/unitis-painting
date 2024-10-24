import React from 'react';
import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayer: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center mt-6">
      <div className="aspect-w-16 aspect-h-9 w-full mt-6">
        <ReactPlayer
          url="https://player.vimeo.com/video/1022728432?h=644ac9b33f"
          width="100%"
          height="100%"
          controls={true}
          muted={false}
          playing={false}
          config={{
            vimeo: {
              playerOptions: {
                responsive: true,
                autoplay: false,
                controls: true,
                background: false,
                muted: false,
                pip: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};const AboutUs: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-12 bg-white" ref={ref}>
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div className="lg:w-1/2 flex items-center" variants={itemVariants}>
            <VideoPlayer />
          </motion.div>
          <div className="lg:w-1/2 space-y-6 flex flex-col justify-center py-4">
            <motion.div
              className="inline-block"
              variants={itemVariants}
            >
              <span className="inline-flex items-center px-3 py-1 bg-amber-100 rounded-full text-amber-600 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 text-amber-400" />
                Expect The Best
              </span>
            </motion.div>
            <motion.h2 className="text-4xl font-bold text-blue-950" variants={itemVariants}>
              We Deliver Quality and Excellence
            </motion.h2>
            <motion.p className="text-lg text-gray-700 leading-relaxed" variants={itemVariants}>
              Unitus Painting Ltd. was founded in 2013. We are trusted professionals, offering high-quality painting services across Greater Vancouver, Fraser Valley, BC Interior, and Calgary.
            </motion.p>
            <motion.p className="text-lg text-gray-700 leading-relaxed" variants={itemVariants}>
              With over 11 years of experience, we specialize in commercial, strata, and residential painting, while also offering services like caulking, wood replacement, power washing, and more. Our clients appreciate our professionalism, attention to detail, and competitive pricing.
            </motion.p>
            <motion.ul className="space-y-2 text-base text-gray-700 text-lg mt-6" variants={containerVariants}>
              <motion.li className="flex items-center" variants={itemVariants}>
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Complete painting and repair services
              </motion.li>
              <motion.li className="flex items-center" variants={itemVariants}>
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Skilled and qualified professionals
              </motion.li>
              <motion.li className="flex items-center" variants={itemVariants}>
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Full workmanship guarantee
              </motion.li>
              <motion.li className="flex items-center" variants={itemVariants}>
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Affordable and reliable
              </motion.li>
              <motion.li className="flex items-center" variants={itemVariants}>
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Exceptional customer service
              </motion.li>
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;