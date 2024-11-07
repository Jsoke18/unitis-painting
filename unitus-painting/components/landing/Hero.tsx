'use client';
import React, { useRef, useEffect } from 'react';
import { MapPin, ChevronRight, Phone } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial time to 6 seconds
    video.currentTime = 6;

    // Add timeupdate listener to check current time
    const handleTimeUpdate = () => {
      if (video.currentTime >= 28) {
        video.currentTime = 6;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    // Cleanup
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

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
          src="https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4"
        />
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full pt-20 pb-16">
          {/* Glass Card Container */}
          <div className="backdrop-blur-xl bg-black/20 p-8 rounded-3xl border border-white/20 shadow-2xl max-w-3xl mt-20">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2.5 mb-8">
              <MapPin className="w-5 h-5 text-amber-400" />
              <p className="text-sm font-medium">
                Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block mb-2">Transform Your Space</span>
              <span className="text-amber-400">Professional Painting Services</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-100/90 mb-8 max-w-2xl">
              Expert residential and commercial painting solutions delivered with precision,
              professionalism, and attention to detail.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/services" className="inline-block">
                <button className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-blue-900 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto">
                  Explore Our Services
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/contact" className="inline-block">
                <button className="px-6 py-3.5 bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 w-full sm:w-auto border border-white/10">
                  <Phone className="w-5 h-5" />
                  Get Free Quote
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