import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-navy-blue animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  isMinimized: boolean;
}

const AboutUsPage: React.FC = () => {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: true,
    isMuted: true,
    isLoaded: false,
    isMinimized: false,
  });

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
    <div className="min-h-screen bg-navy-blue">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
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

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Glassmorphism Container */}
            <motion.div 
              className={`backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-xl
                ${state.isMinimized ? 'w-auto inline-block' : 'w-full'}`}
              layout
              transition={{ duration: 0.3 }}
            >
              {/* Minimize/Maximize Button */}
              <div className="flex justify-end p-4">
                <motion.button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
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

              <AnimatePresence>
                {!state.isMinimized && (
                  <motion.div 
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                      Crafting Excellence in{' '}
                      <span className="text-amber-400">Every Stroke</span>
                    </h1>
                    <p className="text-xl text-white mb-8 leading-relaxed drop-shadow">
                      Since our founding, Unitis Painting has been dedicated to delivering exceptional painting services across British Columbia and Alberta. Our commitment to quality and attention to detail has made us a trusted name in residential, commercial, and strata painting.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video Controls - Always Visible */}
              <div className={`flex items-center space-x-4 ${state.isMinimized ? 'p-2' : 'px-8 pb-8'}`}>
                <motion.button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
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
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;