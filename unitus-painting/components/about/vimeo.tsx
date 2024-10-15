import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const VideoPlayer: React.FC = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto my-12 overflow-hidden">
      <CardHeader className="bg-blue-600 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Why Choose Unitus?
        </h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-w-16 aspect-h-9">
          <ReactPlayer
            url="https://player.vimeo.com/video/1012957597"
            width="100%"
            height="100%"
            controls={true}
            muted={false}
            playing={false}
            config={{
              vimeo: {
                playerOptions: {
                  responsive: true,
                  autoplay: false,
                  controls: true,
                  background: false,
                  muted: false,
                  pip: true,
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;