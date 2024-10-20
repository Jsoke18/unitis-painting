import React from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayer: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <ReactPlayer
          url="https://player.vimeo.com/video/836294434"
          width="100%"
          height="100%"
          playing
          loop
          muted
          config={{
            vimeo: {
              playerOptions: {
                background: true,
                responsive: true,
                autoplay: true,
                controls: false,
                muted: true,
              },
            },
          }}
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Learn More About Unitis Painting</h1>
          <p className="text-xl md:text-2xl mb-8">Ready to Get Started? Click the button below</p>
          <button className="bg-blue-900 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;