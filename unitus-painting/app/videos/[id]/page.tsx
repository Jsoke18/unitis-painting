import Link from 'next/link';

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
      // On the server, use an environment variable or fallback origin
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&origin=${origin}`;
    }
    
    return url;
  } catch (e) {
    return url;
  }
};

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  // Fetch the individual video data from the API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/videos/${params.id}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) {
    // You could integrate Next.js's notFound() here if desired
    return <div className="min-h-screen flex items-center justify-center">Video not found</div>;
  }

  const data = await res.json();
  const video: Video = data.video;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4 pt-32">
        <Link href="/videos" className="text-blue-600 underline mb-4 inline-block">
          ← Back to Videos
        </Link>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={getEmbedUrl(video.url)}
              title={video.name}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="origin"
            />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-950 mb-4">{video.name}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(video.videoDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {/* You can add more video details or description here */}
          </div>
        </div>
      </div>
    </div>
  );
} 