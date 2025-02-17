'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Video {
  id: number;
  name: string;
  videoDate: string;
  url: string;
}

const getEmbedUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Handle Vimeo URLs
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?controls=1&showcontrols=1&background=0&autoplay=0&autopause=1&transparent=0&title=1`;
    }
    
    // Handle YouTube URLs
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else {
        videoId = urlObj.pathname.split('/').pop() || '';
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&origin=${window.location.origin}`;
    }
    
    return url;
  } catch (e) {
    return url;
  }
};

const getVideoThumbnail = (url: string): string => {
  // Try to get thumbnail by replacing video extension with jpg
  const thumbnailUrl = url.replace(/\.(mp4|webm|ogg)$/i, '.jpg');
  
  // You can add a default thumbnail if needed
  const defaultThumbnail = '/images/video-thumbnail-placeholder.jpg';
  
  return thumbnailUrl || defaultThumbnail;
};

const VideoWithThumbnail = ({ video }: { video: Video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Load just enough of the video to get a thumbnail
      video.preload = 'metadata';
      
      // Once metadata is loaded, seek to 0 second
      video.onloadedmetadata = () => {
        if (video.seekable.length > 0) {
          video.currentTime = 0;
        }
      };
      
      // After seeking, capture the frame and pause
      video.onseeked = () => {
        video.pause();
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute top-0 left-0 w-full h-full"
      src={video.url}
      controls
      preload="metadata"
      playsInline
      title={video.name}
    />
  );
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        setVideos(data.videos || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const sortedVideos = [...videos].sort((a, b) => {
    const dateA = new Date(a.videoDate).getTime();
    const dateB = new Date(b.videoDate).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-950 mb-4">
              Featured Videos
            </h1>
            <p className="text-gray-600 max-w-2xl text-lg">
              Meet our team, explore our projects, and discover why clients choose Unitus Painting.
            </p>
          </div>
          <Select
            value={sortOrder}
            onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden h-[400px]">
                <CardContent className="p-0 h-full flex flex-col">
                  <Skeleton className="w-full h-[240px]" />
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {sortedVideos.map((video) => (
              <motion.div key={video.id} variants={item} className="h-full">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white h-[400px]">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      {video.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <VideoWithThumbnail video={video} />
                      ) : (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={getEmbedUrl(video.url)}
                          title={video.name}
                          allow="fullscreen; picture-in-picture"
                          allowFullScreen
                          referrerPolicy="origin"
                        />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <Link
                            href={`/videos/${video.id}`}
                            className="text-xl font-semibold text-blue-950 line-clamp-2"
                          >
                            {video.name}
                          </Link>
                          <a 
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700 transition-colors duration-200 flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0"
                          >
                            <span>Watch on Vimeo</span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="flex-shrink-0"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(video.videoDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No videos available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 