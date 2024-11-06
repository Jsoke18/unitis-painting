import React, { useState, useEffect } from 'react';
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

const AboutUsPage = () => {
  const [state, setState] = useState({
    isPlaying: true,
    isMuted: true,
    isLoaded: false,
    isMinimized: false,
    isMobile: false,
  });

  useEffect(() => {
    const checkMobile = () => setState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative aspect-[16/9] bg-slate-900">
        {/* Mobile Background */}
        {state.iMobile && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 animate-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[size:24px_24px] opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
          </div>
        )}

        {/* Video Background - Desktop Only */}
        {!state.iMobile && (
          <div className="absolute inset-0">
            <ReactPlayer
              url="https://player.vimeo.com/video/836294434"
              width="100%"
              height="100%"
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
              style={{ position: 'absolute', top: 0 }}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        {/* Main Content */}
        <div className="absolute inset-0 container mx-auto px-4 flex items-center justify-start">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className={`
                backdrop-blur-lg bg-black/50 rounded-2xl border border-white/20 shadow-2xl
                ${state.isMinimized ? 'w-auto inline-block' : 'w-full'}
                ${state.iMobile ? 'p-8' : ''}
              `}
              layout
            >
              {/* Desktop Controls */}
              {!state.iMobile && (
                <div className={`flex ${state.isMinimized ? 'gap-6 px-6' : 'justify-between'} p-4`}>
                  <div className={`flex items-center ${state.isMinimized ? 'gap-6' : 'space-x-4'}`}>
                    <motion.button
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                      onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {state.isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                      onClick={() => setState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {state.isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </motion.button>
                  </div>
                  <motion.button
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                    onClick={() => setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {state.isMinimized ? <Maximize2 className="w-5 h-5 text-white" /> : <Minimize2 className="w-5 h-5 text-white" />}
                  </motion.button>
                </div>
              )}

              {/* Content */}
              <AnimatePresence>
                {(!state.isMinimized || state.iMobile) && (
                  <motion.div 
                    className={`${state.iMobile ? 'space-y-4' : 'px-8 pb-8'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h1 className={`font-bold text-white ${state.iMobile ? 'text-3xl leading-tight' : 'text-4xl md:text-6xl'} mb-4`}>
                      Crafting Excellence in <span className="text-amber-300">Every Stroke</span>
                    </h1>
                    <p className={`${state.iMobile ? 'text-base leading-relaxed' : 'text-xl'} text-white mb-4`}>
                      Since our founding, Unitis Painting has been dedicated to delivering exceptional painting services across British Columbia and Alberta. Our commitment to quality and attention to detail has made us a trusted name in residential, commercial, and strata painting.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About Our Company</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive to transform spaces with exceptional painting services that exceed expectations. 
                Our experienced team combines technical expertise with artistic vision to deliver results 
                that stand the test of time.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Quality craftsmanship in every project</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Transparent communication and pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Environmental responsibility</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Customer satisfaction guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes bg {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-bg {
          background-size: 200% 200%;
          animation: bg 15s linear infinite alternate;
        }
      `}</style>
    </>
  );
};

export default AboutUsPage;