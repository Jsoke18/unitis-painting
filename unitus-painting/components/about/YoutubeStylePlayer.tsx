import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, VolumeX, Volume2, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface YouTubeStylePlayerProps {
  url: string;
}

const YouTubeStylePlayer: React.FC<YouTubeStylePlayerProps> = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      resetControlsTimer();
    };

    const handleMouseLeave = () => {
      setShowControls(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const resetControlsTimer = () => {
    if (playing) {
      clearTimeout(controlsTimer.current);
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const controlsTimer = useRef<NodeJS.Timeout>();

  const handlePlayPause = () => setPlaying(!playing);
  const handleVolumeChange = (value: number[]) => setVolume(value[0]);
  const handleToggleMute = () => setMuted(!muted);
  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };
  const handleDuration = (duration: number) => setDuration(duration);
  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
    setSeeking(true);
  };
  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  };
  const handleFullscreen = () => {
    const element = containerRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-black">
      <ReactPlayer
        ref={playerRef}
        url={url}
        className="react-player"
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4"
      >
        <Slider
          className="w-full mb-2"
          value={[played]}
          onValueChange={handleSeekChange}
          onValueCommit={handleSeekMouseUp}
          max={0.999999}
          step={0.000001}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="text-white hover:text-gray-300"
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleMute}
              className="text-white hover:text-gray-300"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            <Slider
              className="w-24"
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
            />
            <span className="text-sm">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300"
            >
              <Settings size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="text-white hover:text-gray-300"
            >
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubeStylePlayer;