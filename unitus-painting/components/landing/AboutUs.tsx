import React from 'react';
import { Star } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const AboutUs: React.FC = () => {
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
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <motion.div className="lg:w-1/2 h-[400px] lg:h-[600px]" variants={itemVariants}>
            <iframe
              title="vimeo-player"
              src="https://player.vimeo.com/video/1012957597"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </motion.div>
          <div className="lg:w-1/2 space-y-6">
            <motion.div
              className="inline-flex items-center px-3 py-1 bg-amber-100 rounded-full text-amber-600 text-sm font-medium"
              variants={itemVariants}
            >
              <Star className="w-4 h-4 mr-2 text-amber-400" />
              Expect The Best
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
            <div className="flex items-start space-x-8">
              <motion.div
                className="bg-gray-100 p-8 rounded-lg text-center shadow-md mt-10"
                variants={itemVariants}
              >
                <div className="text-5xl font-bold text-amber-400">11</div>
                <div className="text-sm font-semibold text-blue-950 mt-2">Years Of<br />Experience</div>
              </motion.div>
              <motion.ul className="space-y-2 text-base text-gray-700 text-lg" variants={containerVariants}>
                <motion.li className="flex items-center mt-10" variants={itemVariants}>
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
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;