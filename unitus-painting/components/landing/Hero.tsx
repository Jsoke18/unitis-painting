'use client';
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ChevronRight, Phone } from 'lucide-react';
import Link from 'next/link';

type HeroContent = {
  location: { text: string };
  mainHeading: { line1: string; line2: string };
  subheading: string;
  buttons: {
    primary: { text: string; link: string };
    secondary: { text: string; link: string };
  };
  videoUrl: string;
};

const defaultContent: HeroContent = {
  location: { text: "Serving Greater Vancouver" },
  mainHeading: {
    line1: "Transform Your Space",
    line2: "Professional Painting Services"
  },
  subheading: "Expert residential and commercial painting solutions.",
  buttons: {
    primary: { text: "Explore Services", link: "/services" },
    secondary: { text: "Get Quote", link: "/contact" }
  },
  videoUrl: "https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4"
};

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    const fetchContent = async () => {
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to load hero content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();

    // Video handling
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 6;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 28) {
        video.currentTime = 6;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-800 min-h-[600px]" />;
  }

  return (
    <section className="relative w-full text-white min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Video Container */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className={`h-full w-full ${isMobile ? 'object-cover md:object-fill' : 'object-cover'}`}
          style={{ 
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100vh' : 'none'
          }}
          autoPlay
          muted
          playsInline
          loop
          src={content.videoUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full pt-12 md:pt-20 pb-12 md:pb-16">
          <div className="backdrop-blur-xl bg-black/20 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl max-w-3xl mt-8 md:mt-20">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 md:px-4 md:py-2.5 mb-6 md:mb-8">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              <p className="text-xs md:text-sm font-medium">{content.location.text}</p>
            </div>

            {/* Headings */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              <span className="block mb-2">{content.mainHeading.line1}</span>
              <span className="text-amber-400">{content.mainHeading.line2}</span>
            </h1>

            <p className="text-base md:text-xl text-gray-100/90 mb-6 md:mb-8 max-w-2xl">
              {content.subheading}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
              <Link href={content.buttons.primary.link} className="w-full sm:w-auto">
                <button className="w-full px-4 md:px-6 py-3 md:py-3.5 bg-amber-400 hover:bg-amber-500 text-blue-900 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                  {content.buttons.primary.text}
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </Link>
              <Link href={content.buttons.secondary.link} className="w-full sm:w-auto">
                <button className="w-full px-4 md:px-6 py-3 md:py-3.5 bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-white/10">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  {content.buttons.secondary.text}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;