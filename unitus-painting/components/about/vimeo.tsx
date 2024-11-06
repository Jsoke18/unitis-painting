import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  isMinimized: boolean;
  isMobile: boolean;
}

const AboutUsPage: React.FC = () => {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: true,
    isMuted: true,
    isLoaded: false,
    isMinimized: false,
    isMobile: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      setState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePlayPause = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleMuteUnmute = () => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleBuffer = () => {
    if (!state.isLoaded) {
      setState(prev => ({ ...prev, isLoaded: true }));
    }
  };

  const toggleMinimize = () => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute -inset-[10px] bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient 8s linear infinite',
              filter: 'blur(20px)',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.7),rgba(0,0,0,0.9))]" />
      </div>

      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Video Background - Desktop Only */}
        {!state.isMobile && (
          <div className="absolute inset-0">
            <ReactPlayer
              url="https://player.vimeo.com/video/836294434"
              width="100%"
              height="100%"
              playing={state.isPlaying}
              loop
              muted={state.isMuted}
              onBuffer={handleBuffer}
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
          </div>
        )}

        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-start justify-center">
          <motion.div 
            className="max-w-3xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Glass Content Container */}
            <motion.div 
              className={`
                backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl
                overflow-hidden
                ${state.isMinimized ? 'w-auto inline-block' : 'w-full'}
              `}
              layout
              transition={{ duration: 0.3 }}
            >
              {/* Accent border */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              {/* Controls - Desktop Only */}
              {!state.isMobile && (
                <div className="flex justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                      onClick={handlePlayPause}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {state.isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                      onClick={handleMuteUnmute}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {state.isMuted ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </motion.button>
                  </div>
                  <motion.button
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                    onClick={toggleMinimize}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {state.isMinimized ? (
                      <Maximize2 className="w-5 h-5 text-white" />
                    ) : (
                      <Minimize2 className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>
              )}

              <AnimatePresence>
                {(!state.isMinimized || state.isMobile) && (
                  <motion.div 
                    className="p-8 space-y-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h1 
                      className={`
                        font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
                        ${state.iMobile ? 'text-3xl leading-tight' : 'text-4xl md:text-6xl'} 
                      `}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      Crafting Excellence in{' '}
                      <span className="text-amber-300">Every Stroke</span>
                    </motion.h1>
                    <p className={`
                      ${state.iMobile ? 'text-base leading-relaxed' : 'text-xl'} 
                      text-white
                    `}>
                      Since our founding, Unitis Painting has been dedicated to delivering exceptional painting services across British Columbia and Alberta. Our commitment to quality and attention to detail has made us a trusted name in residential, commercial, and strata painting.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;