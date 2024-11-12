'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { AboutHeroContent } from '@/types/AboutHero';

const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-navy-blue flex items-center justify-center">
      <motion.div 
        className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  ),
});

type State = {
  isPlaying: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  isMinimized: boolean;
  isMobile: boolean;
  content: AboutHeroContent | null;
};

const AboutUsPage = () => {
  const dragControls = useDragControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const minimizedRef = useRef<HTMLDivElement>(null);
  
  const [state, setState] = useState<State>({
    isPlaying: true,
    isMuted: true,
    isLoaded: false,
    isMinimized: false,
    isMobile: false,
    content: null,
  });

  useEffect(() => {
    const checkMobile = () => setState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/about-hero');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setState(prev => ({ ...prev, content: data }));
      } catch (error) {
        console.error('Error fetching about hero content:', error);
      }
    };

    fetchContent();
  }, []);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (!state.content) {
    return (
      <div className="w-full min-h-[60vh] bg-navy-blue flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[60vh] md:aspect-[21/9] overflow-hidden"
    >
      {state.isMobile && state.content.isMobileEnabled ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950" />
          <motion.div 
            className="absolute inset-0"
            initial={false}
            animate="animate"
            variants={gradientVariants}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/5" 
              style={{ backgroundSize: '200% 200%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(251,191,36)_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03]" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <ReactPlayer
            url={state.content.videoUrl}
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
            }}
            playing={state.isPlaying}
            loop
            muted={state.isMuted}
            onBuffer={() => !state.isLoaded && setState(prev => ({ ...prev, isLoaded: true }))}
            playsinline
            config={{
              vimeo: {
                playerOptions: {
                  background: true,
                  responsive: true,
                  autoplay: true,
                  controls: false,
                  muted: state.isMuted,
                  quality: 'auto',
                  preload: true,
                },
              },
            }}
          />
          <motion.div 
            className="absolute inset-0" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </motion.div>
        </div>
      )}

      <div className="absolute inset-0">
        {!state.isMinimized ? (
          <div className="h-full flex items-center">
            <div className="w-full container mx-auto px-6 md:px-8 lg:px-16">
              <motion.div 
                className="w-full md:max-w-4xl"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div 
                  className="backdrop-blur-lg bg-black/40 rounded-2xl border border-white/10 shadow-2xl w-full p-8"
                  layout
                  transition={{
                    layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  {!state.isMobile && (
                    <motion.div className="flex justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {state.isPlaying ? 
                            <Pause className="w-5 h-5 text-white" /> : 
                            <Play className="w-5 h-5 text-white" />
                          }
                        </motion.button>
                        <motion.button
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          onClick={() => setState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {state.isMuted ? 
                            <VolumeX className="w-5 h-5 text-white" /> : 
                            <Volume2 className="w-5 h-5 text-white" />
                          }
                        </motion.button>
                      </div>
                      <motion.button
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        onClick={() => setState(prev => ({ ...prev, isMinimized: true }))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minimize2 className="w-5 h-5 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  <motion.div 
                    className="space-y-6 md:space-y-8"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <h1 className="font-bold text-white text-4xl md:text-5xl leading-tight tracking-tight">
                      <motion.span
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="block"
                      >
                        {state.content.mainHeading.line1}
                      </motion.span>
                      <motion.span
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                        className="text-amber-400 mt-2 block"
                      >
                        {state.content.mainHeading.line2}
                      </motion.span>
                    </h1>
                    <motion.p 
                      className="text-lg md:text-xl leading-relaxed text-white/95 max-w-3xl"
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.6 }}
                    >
                      {state.content.description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div 
            ref={minimizedRef}
            className="absolute left-5 bottom-5 w-[300px] backdrop-blur-lg bg-black/40 rounded-2xl border border-white/10 shadow-2xl p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            drag
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
          >
            <motion.div 
              className="flex items-center justify-between cursor-move"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex items-center gap-4">
                <motion.button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {state.isPlaying ? 
                    <Pause className="w-5 h-5 text-white" /> : 
                    <Play className="w-5 h-5 text-white" />
                  }
                </motion.button>
                <motion.button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  onClick={() => setState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {state.isMuted ? 
                    <VolumeX className="w-5 h-5 text-white" /> : 
                    <Volume2 className="w-5 h-5 text-white" />
                  }
                </motion.button>
              </div>
              <motion.button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                onClick={() => setState(prev => ({ ...prev, isMinimized: false }))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AboutUsPage;