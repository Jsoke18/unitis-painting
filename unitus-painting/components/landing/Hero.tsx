'use client';
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ChevronRight, Phone } from 'lucide-react';
import Link from 'next/link';

// Define a type for the content structure
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

// Default content to prevent undefined errors
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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to load hero content:', error);
        // Keep default content if fetch fails
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
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a skeleton loader
  }

  return (
    <section className="relative w-full text-white min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          src={content.videoUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full pt-20 pb-16">
          <div className="backdrop-blur-xl bg-black/20 p-8 rounded-3xl border border-white/20 shadow-2xl max-w-3xl mt-20">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2.5 mb-8">
              <MapPin className="w-5 h-5 text-amber-400" />
              <p className="text-sm font-medium">{content.location.text}</p>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block mb-2">{content.mainHeading.line1}</span>
              <span className="text-amber-400">{content.mainHeading.line2}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-100/90 mb-8 max-w-2xl">
              {content.subheading}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href={content.buttons.primary.link} className="inline-block">
                <button className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-blue-900 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto">
                  {content.buttons.primary.text}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href={content.buttons.secondary.link} className="inline-block">
                <button className="px-6 py-3.5 bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 w-full sm:w-auto border border-white/10">
                  <Phone className="w-5 h-5" />
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