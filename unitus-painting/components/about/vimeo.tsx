'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';

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
  position: {
    x: number;
    y: number;
  };
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
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    const checkMobile = () => setState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (state.isMinimized && containerRef.current && minimizedRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const minimizedRect = minimizedRef.current.getBoundingClientRect();
      
      const newX = 20;
      const newY = containerRect.height - minimizedRect.height - 20;
      
      setState(prev => ({
        ...prev,
        position: { x: newX, y: newY }
      }));
    } else {
      setState(prev => ({
        ...prev,
        position: { x: 0, y: 0 }
      }));
    }
  }, [state.isMinimized]);

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

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[60vh] md:aspect-[21/9] overflow-hidden"
    >
      {state.isMobile ? (
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
          <div className="absolute inset-0">
            <ReactPlayer
              url="https://player.vimeo.com/video/836294434"
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
        </div>
      )}

      <div className="absolute inset-0 flex items-center">
        <div className="w-full container mx-auto px-6 md:px-8 lg:px-16">
          <motion.div 
            className={`w-full md:max-w-4xl ${state.isMobile ? 'my-20' : ''}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div 
              ref={minimizedRef}
              className={`
                backdrop-blur-lg bg-black/40 rounded-2xl border border-white/10 shadow-2xl
                ${state.isMinimized ? 'absolute cursor-move' : 'w-full'}
                ${state.isMobile ? 'py-12 px-6' : 'p-8'}
                ${state.isMinimized ? 'w-[300px]' : ''}
              `}
              layout
              drag={state.isMinimized}
              dragControls={dragControls}
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={containerRef}
              animate={state.isMinimized ? {
                x: state.position.x,
                y: state.position.y,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              } : {
                x: 0,
                y: 0
              }}
              onDragEnd={(event, info) => {
                if (containerRef.current && minimizedRef.current) {
                  const containerRect = containerRef.current.getBoundingClientRect();
                  const minimizedRect = minimizedRef.current.getBoundingClientRect();
                  
                  const newX = Math.max(20, Math.min(
                    state.position.x + info.offset.x,
                    containerRect.width - minimizedRect.width - 20
                  ));
                  const newY = Math.max(20, Math.min(
                    state.position.y + info.offset.y,
                    containerRect.height - minimizedRect.height - 20
                  ));
                  
                  setState(prev => ({
                    ...prev,
                    position: { x: newX, y: newY }
                  }));
                }
              }}
              transition={{
                layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
              }}
            >
              {!state.isMobile && (
                <motion.div 
                  className={`flex ${state.isMinimized ? 'gap-4 px-4' : 'justify-between'} mb-6`}
                  layout
                  onPointerDown={(e) => {
                    if (state.isMinimized) {
                      dragControls.start(e);
                    }
                  }}
                >
                  <div className={`flex items-center ${state.isMinimized ? 'gap-4' : 'space-x-4'}`}>
                    <motion.button
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
                      transition={{ duration: 0.2 }}
                    >
                      {state.isMuted ? 
                        <VolumeX className="w-5 h-5 text-white" /> : 
                        <Volume2 className="w-5 h-5 text-white" />
                      }
                    </motion.button>
                  </div>
                  <motion.button
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    onClick={() => setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {state.isMinimized ? 
                      <Maximize2 className="w-5 h-5 text-white" /> : 
                      <Minimize2 className="w-5 h-5 text-white" />
                    }
                  </motion.button>
                </motion.div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {(!state.isMinimized || state.isMobile) && (
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
                        Crafting Excellence in
                      </motion.span>
                      <motion.span
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                        className="text-amber-400 mt-2 block"
                      >
                        Every Stroke
                      </motion.span>
                    </h1>
                    <motion.p 
                      className="text-lg md:text-xl leading-relaxed text-white/95 max-w-3xl"
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.6 }}
                    >
                      Since our founding, Unitis Painting has been dedicated to delivering exceptional painting services across British Columbia and Alberta. Our commitment to quality and attention to detail has made us a trusted name in residential, commercial, and strata painting.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;