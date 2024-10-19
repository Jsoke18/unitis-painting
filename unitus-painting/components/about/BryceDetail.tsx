import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, VolumeX, Volume2, Maximize } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"

// Custom Video Player Component
const VideoPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => setPlaying(!playing);
  const handleVolumeChange = (value: number[]) => setVolume(value[0]);
  const handleToggleMute = () => setMuted(!muted);
  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };
  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
    setSeeking(true);
  };
  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  };
  const handleFullscreen = () => {
    const element = document.querySelector('.react-player');
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-[458px] bg-gray-900">
      <ReactPlayer
        ref={playerRef}
        url="/videos/meet-the-manager-bryce.mp4"
        className="react-player"
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPause}
            className="text-white hover:text-gray-300"
          >
            {playing ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleMute}
              className="text-white hover:text-gray-300 mr-2"
            >
              {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </Button>
            <Slider
              className="w-24"
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFullscreen}
            className="text-white hover:text-gray-300"
          >
            <Maximize size={24} />
          </Button>
        </div>
        <Slider
          className="w-full"
          value={[played]}
          onValueChange={handleSeekChange}
          onValueCommit={handleSeekMouseUp}
          max={1}
          step={0.01}
        />
      </div>
    </div>
  );
};

// About Section Component
interface AboutSectionProps {
  name: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  image: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ name, title, description, phone, email, image }) => {
  return (
    <Card className="mx-auto mt-20 max-w-6xl shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/5">
            <Avatar className="w-full h-auto aspect-square">
              <AvatarImage src={image} alt={`${name}'s portrait`} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          <div className="md:w-3/5">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold text-blue-950">About {name}</CardTitle>
              <p className="text-xl text-zinc-500 mt-2">{title}</p>
            </CardHeader>
            <p className="mt-4 text-zinc-700 leading-relaxed">{description}</p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center">
                <span className="font-semibold text-blue-950 w-20">Phone:</span>
                <span className="text-zinc-700">{phone}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-blue-950 w-20">Email:</span>
                <span className="text-zinc-700">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Newsletter Section Component
const NewsletterSection: React.FC = () => {
  return (
    <section className="bg-amber-400 py-20 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-950">Subscribe to Our Newsletter</h2>
            <p className="mt-4 text-blue-950/80">
              Stay in touch with us to get the latest news. We're here to meet your electrical service needs for your dream building.
            </p>
          </div>
          <div className="md:w-1/2">
            <form className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Component
const MainComponent: React.FC = () => {
  const aboutProps = {
    name: "Bryce Cayer",
    title: "Founder, CEO, & Senior Project Manager",
    description: "Having worked in the painting industry since 2006, Chris and Bryce founded Unitus Painting in 2013. Long before their business partnership began, Chris and Bryce were roommates living in Victoria during university finishing their degrees in commerce. Co-incidentally after finishing university, both of them began working in the painting industry: Bryce with a painting company and Chris with a paint manufacturer. Today they successfully run operations at Unitus Painting. Bryce and his family currently reside in Maple Ridge, where he and his wife, Danielle, have three children: Sidney, Autumn and baby Kasen (Bryce, Sidney and Kasen in photo). They also have a small chihuahua, Romeo, who is quite the character. When Bryce was asked why customers choose Unitus Painting over other companies, he answered \"Our customers are busy people that value their time. Due to the systems we have developed and the importance we place on delivering a positive experience our clients feel at ease knowing that everything from the quoting stage to job completion will be done in a professional efficient manner.\"",
    phone: "604-716-4054",
    email: "bryce@unituspainting.com",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/4d0ff4655fbd2d991505c37d91dea0861c1b998ce00f74989885a0bf2fae9ae5?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VideoPlayer />
      <AboutSection {...aboutProps} />
      <NewsletterSection />
    </div>
  );
};

export default MainComponent;