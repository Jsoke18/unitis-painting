import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { StrataServicesContent, ServiceItem, ProjectItem } from './StrataServiceContent';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Header: React.FC<{ title: string; image: string }> = ({ title, image }) => (
  <motion.header
    className="relative w-full min-h-[389px] text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <img src={image} alt="Commercial building background" className="absolute inset-0 object-cover w-full h-full" />
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

const ServiceList: React.FC<{ services: ServiceItem[]; title: string }> = ({ services, title }) => (
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
            <Link href={service.link} passHref>
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

const FeaturedProject = ({ title, subtitle, description, videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newValue) => {
    setVolume(newValue[0]);
    setMuted(newValue[0] === 0);
  };
  const handleProgress = (state) => setPlayed(state.played);
  const handleMuteToggle = () => setMuted(!muted);
  const handleSeekChange = (newValue) => {
    setPlayed(newValue[0]);
    playerRef.current.seekTo(newValue[0]);
  };

  const formatTime = (seconds) => {
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
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectShowcase: React.FC<{ projects: ProjectItem[]; title: string }> = ({ projects, title }) => (
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
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
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

const CallToAction: React.FC<{ title: string; buttonText: string }> = ({ title, buttonText }) => (
  <motion.section
    className="bg-amber-400 py-16 mt-16"
    variants={fadeIn}
    initial="initial"
    animate="animate"
  >
    <div className="container mx-auto flex items-center justify-center space-x-6">
      <h2 className="text-3xl font-bold text-black">{title}</h2>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant="default" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
          {buttonText}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  </motion.section>
);

const StrataServiceDetails: React.FC = () => {
  return (
    <div className="bg-white mt-24">
      <main className="container mx-auto px-4 py-16">
        {/* Mobile-first layout: Stack video/description above checkmarks */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
          {/* Video and description section - full width on mobile, 2/3 width on desktop */}
          <section className="order-1 lg:order-2 lg:col-span-2">
            <FeaturedProject 
              title="Staples in Burnaby: Exterior Power Washing and Repainting"
              subtitle={StrataServicesContent.descriptionTitle}
              description={StrataServicesContent.descriptionText}
              videoSrc={StrataServicesContent.descriptionVideo}
            />
          </section>
          
          {/* Checkmarks section - full width on mobile, 1/3 width on desktop */}
          <aside className="order-2 lg:order-1 lg:col-span-1">
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