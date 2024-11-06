'use client'
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import QuoteRequestDialog from "@/components/landing/QuoteRequestDialog";

// Types
interface ServiceItem {
  name: string;
  link: string;
}

interface ProjectItem {
  title: string;
  image: string;
}

interface HeaderProps {
  title: string;
  image: string;
}

interface ServiceListProps {
  services: ServiceItem[];
  title: string;
}

interface ProjectShowcaseProps {
  projects: ProjectItem[];
  title: string;
}

interface CallToActionProps {
  title: string;
  buttonText: string;
}

interface FeaturedProjectProps {
  title: string;
  subtitle: string;
  description: string;
  videoSrc: string;
}

// Content Data
export const StrataServicesContent = {
  servicesTitle: "Our Strata Services",
  services: [
    { name: "Exterior Painting", link: "/services/exterior-painting" },
    { name: "Interior Common Areas", link: "/services/interior-common-areas" },
    { name: "Parkade Painting", link: "/services/parkade-painting" },
    { name: "Carpentry & Repairs", link: "/services/carpentry-repairs" },
    { name: "Power Washing", link: "/services/power-washing" },
    { name: "Line Painting", link: "/services/line-painting" },
    { name: "Warranty Work", link: "/services/warranty-work" },
  ],
  descriptionTitle: "Professional Strata Painting Services",
  descriptionText: "We specialize in providing comprehensive painting and maintenance services for strata properties, ensuring high-quality results while minimizing disruption to residents.",
  descriptionVideo: "https://example.com/sample-strata-video.mp4",
  projectShowcaseTitle: "Featured Strata Projects",
  projects: [
    { title: "164-Unit Complex Repaint", image: "/images/project1.jpg" },
    { title: "Parkade Restoration", image: "/images/project2.jpg" },
    { title: "Common Area Renovation", image: "/images/project3.jpg" },
    { title: "Building Exterior Refresh", image: "/images/project4.jpg" },
  ],
  ctaTitle: "Ready to Transform Your Strata Property?",
  ctaButtonText: "Get a Quote"
};

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Header Component
const Header: React.FC<HeaderProps> = ({ title, image }) => (
  <motion.header
    className="relative w-full min-h-[389px] text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <img 
      src={image} 
      alt="Strata building background" 
      className="absolute inset-0 object-cover w-full h-full" 
    />
    <div className="absolute inset-0 bg-blue-950 bg-opacity-80 flex items-center justify-center">
      <motion.h1
        className="text-6xl font-extrabold tracking-wider text-center px-4"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        {title}
      </motion.h1>
    </div>
  </motion.header>
);

// Service List Component
const ServiceList: React.FC<ServiceListProps> = ({ services, title }) => (
  <Card className="w-full h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-3xl font-bold text-blue-950">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow pt-4">
      <ul className="space-y-4">
        {services.map((service, index) => (
          <motion.li
            key={index}
            className="flex items-center space-x-3"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          >
            <Check className="text-green-500 h-6 w-6 flex-shrink-0" />
            <Link href={service.link}>
              <span className="text-zinc-700 text-lg leading-tight cursor-pointer hover:text-blue-600 transition-colors duration-200">
                {service.name}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Project Showcase Component
const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects, title }) => (
  <section className="mt-16">
    <motion.h2
      className="text-3xl font-extrabold text-blue-950 text-center mb-8"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      {title}
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={index}
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            rotate: 1,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 10 
            }
          }}
          className="cursor-pointer"
        >
          <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl">
            <CardContent className="p-0">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover rounded-t-lg" 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-blue-950">{project.title}</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </section>
);

// Call to Action Component
const CallToAction: React.FC<CallToActionProps> = ({ title, buttonText }) => (
  <motion.section
    className="bg-amber-400 py-16 mt-16"
    variants={fadeIn}
    initial="initial"
    animate="animate"
  >
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 px-4">
      <h2 className="text-3xl font-bold text-black text-center md:text-left">{title}</h2>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <QuoteRequestDialog
          buttonClassName="bg-white text-gray-900 hover:bg-gray-100 inline-flex items-center px-6 py-3 text-lg font-medium rounded-md shadow-lg"
          buttonContent={
            <>
              {buttonText}
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          }
        />
      </motion.div>
    </div>
  </motion.section>
);

// Featured Project Component with Video Player
const FeaturedProject: React.FC<FeaturedProjectProps> = ({ title, subtitle, description, videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
    setMuted(newValue[0] === 0);
  };
  const handleProgress = (state: { played: number }) => setPlayed(state.played);
  const handleMuteToggle = () => setMuted(!muted);
  const handleSeekChange = (newValue: number[]) => {
    setPlayed(newValue[0]);
    playerRef.current?.seekTo(newValue[0]);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <ReactPlayer
            ref={playerRef}
            url={videoSrc}
            width="100%"
            height="100%"
            playing={isPlaying}
            volume={volume}
            muted={muted}
            loop
            progressInterval={1000}
            onProgress={handleProgress}
            onDuration={setDuration}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center justify-between mb-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleMuteToggle}
                  className="text-white hover:bg-white/20"
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  className="w-24"
                  value={[muted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Slider
                className="flex-grow"
                value={[played]}
                max={1}
                step={0.001}
                onValueChange={handleSeekChange}
              />
              <span className="text-white text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Badge variant="default" className="mb-4 bg-blue-950 text-white hover:bg-blue-700">
            Featured Project
          </Badge>
          <h2 className="text-2xl font-bold text-blue-950 mb-2">{title}</h2>
          <h3 className="text-xl font-semibold text-black mb-4">{subtitle}</h3>
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Strata Services Page Component
const StrataServiceDetails: React.FC = () => {
  return (
    <div className="bg-white mt-12 lg:mt-24">
      <main className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 h-full order-2 lg:order-1 hidden lg:block">
            <ServiceList 
              services={StrataServicesContent.services} 
              title={StrataServicesContent.servicesTitle} 
            />
          </aside>

          <section className="lg:col-span-2 order-1 lg:order-2">
            <FeaturedProject 
              title="164 Townhouses in Port Moody: Full Repaint and Carpentry"
              subtitle={StrataServicesContent.descriptionTitle}
              description={StrataServicesContent.descriptionText}
              videoSrc={StrataServicesContent.descriptionVideo}
            />
          </section>

          <aside className="lg:col-span-1 h-full order-2 lg:hidden">
            <ServiceList 
              services={StrataServicesContent.services} 
              title={StrataServicesContent.servicesTitle} 
            />
          </aside>
        </div>
        
        <ProjectShowcase 
          projects={StrataServicesContent.projects} 
          title={StrataServicesContent.projectShowcaseTitle} 
        />
      </main>
      
      <CallToAction 
        title={StrataServicesContent.ctaTitle} 
        buttonText={StrataServicesContent.ctaButtonText} 
      />
    </div>
  );
};

export default StrataServiceDetails;