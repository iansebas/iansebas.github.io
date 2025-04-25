'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoConfig {
  id: string;
  videoId?: string;
  imageUrl?: string;
  startTime?: number;
  endTime?: number;
  width: number;
  height: number;
  shouldCrop?: boolean;
  cropScale?: number;
  cropTranslate?: { x: number; y: number };
}

interface Position {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Video configurations
const VIDEOS: VideoConfig[] = [
  {
    id: 'aws_video',
    videoId: 'KS12GgvBUIE', // AWS presentation video
    startTime: 50,
    endTime: 180,
    width: 360,
    height: 144,
    shouldCrop: true,
    cropScale: 1.3,
    cropTranslate: { x: -15, y: -15 }
  },
  {
    id: 'eightwall_video',
    videoId: 'yNbjrSomA-M', // 8th Wall video
    startTime: 7,
    endTime: 10,
    width: 270,
    height: 152,
    shouldCrop: false
  },
  {
    id: 'devkit_image',
    imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iqUArhhSLOX1jsmcGOyAbA.png',
    width: 252,
    height: 144,
    shouldCrop: false
  },
  {
    id: 'meshed_video',
    videoId: 'meshed',
    width: 288,
    height: 162,
    shouldCrop: false
  }
];

const FloatingVideos: React.FC = () => {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const animationFrameRef = useRef<number>();
  const frameCountRef = useRef(0);
  const SIDEBAR_WIDTH = 256;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return;

    // Initialize positions on opposite sides to prevent overlap
    const initialPositions: Record<string, Position> = {};
    
    // Calculate available space
    const availableWidth = window.innerWidth - SIDEBAR_WIDTH - 100;
    const availableHeight = window.innerHeight - 100;

    // Place AWS video on the left side
    initialPositions['aws_video'] = {
      x: SIDEBAR_WIDTH + 100,
      y: availableHeight / 4,
      vx: 0.1, // Reduced speed
      vy: 0.05 // Reduced speed
    };

    // Place 8th Wall video on the right side
    initialPositions['eightwall_video'] = {
      x: window.innerWidth - 400,
      y: (availableHeight * 3) / 4,
      vx: -0.1, // Reduced speed
      vy: -0.05 // Reduced speed
    };

    // Place devkit image in the middle
    initialPositions['devkit_image'] = {
      x: window.innerWidth / 2 - 126,
      y: availableHeight / 2 - 72,
      vx: 0.05, // Reduced speed
      vy: 0.025 // Reduced speed
    };

    // Place meshed video on the right side
    initialPositions['meshed_video'] = {
      x: window.innerWidth - 340,
      y: availableHeight / 3,
      vx: -0.08, // Reduced speed
      vy: 0.04 // Reduced speed
    };

    setPositions(initialPositions);

    const animate = () => {
      frameCountRef.current += 1;
      
      setPositions(prev => {
        const next = { ...prev };
        const bounds = {
          left: SIDEBAR_WIDTH + 20,
          right: window.innerWidth - 20,
          top: 20,
          bottom: window.innerHeight - 20
        };

        // Update each video's position with simplified physics
        VIDEOS.forEach((video1, i) => {
          const pos1 = next[video1.id];
          
          // Simplified wall collisions
          if (pos1.x <= bounds.left || pos1.x + video1.width >= bounds.right) {
            pos1.vx = -pos1.vx * 0.95;
            pos1.x = pos1.x <= bounds.left ? bounds.left + 5 : bounds.right - video1.width - 5;
          }
          if (pos1.y <= bounds.top || pos1.y + video1.height >= bounds.bottom) {
            pos1.vy = -pos1.vy * 0.95;
            pos1.y = pos1.y <= bounds.top ? bounds.top + 5 : bounds.bottom - video1.height - 5;
          }

          // Keep within bounds
          pos1.x = Math.max(bounds.left + 5, Math.min(bounds.right - video1.width - 5, pos1.x));
          pos1.y = Math.max(bounds.top + 5, Math.min(bounds.bottom - video1.height - 5, pos1.y));

          // Simplified collision detection - only check with next video
          if (i < VIDEOS.length - 1) {
            const video2 = VIDEOS[i + 1];
            const pos2 = next[video2.id];

            const dx = (pos2.x + video2.width/2) - (pos1.x + video1.width/2);
            const dy = (pos2.y + video2.height/2) - (pos1.y + video1.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = Math.sqrt(
              Math.pow((video1.width + video2.width) / 2, 2) +
              Math.pow((video1.height + video2.height) / 2, 2)
            ) * 0.8;

            if (distance < minDistance) {
              // Simplified collision response
              const tempVx = pos1.vx;
              const tempVy = pos1.vy;
              pos1.vx = pos2.vx * 0.95;
              pos1.vy = pos2.vy * 0.95;
              pos2.vx = tempVx * 0.95;
              pos2.vy = tempVy * 0.95;

              // Simple push apart
              const pushScale = 0.3;
              const pushX = (dx / distance) * Math.abs(minDistance - distance) * pushScale;
              const pushY = (dy / distance) * Math.abs(minDistance - distance) * pushScale;
              
              pos1.x -= pushX;
              pos1.y -= pushY;
              pos2.x += pushX;
              pos2.y += pushY;
            }
          }

          // Update position
          pos1.x += pos1.vx;
          pos1.y += pos1.vy;

          // Reduced velocity boost frequency
          if (frameCountRef.current % 300 === 0) {
            const speed = Math.sqrt(pos1.vx * pos1.vx + pos1.vy * pos1.vy);
            if (speed < 0.05) {
              const angle = Math.random() * Math.PI * 2;
              const boost = 0.03;
              pos1.vx += Math.cos(angle) * boost;
              pos1.vy += Math.sin(angle) * boost;
            }
          }

          // Maintain velocity within gentler bounds
          const speed = Math.sqrt(pos1.vx * pos1.vx + pos1.vy * pos1.vy);
          const minSpeed = 0.03;
          const maxSpeed = 0.15;
          
          if (speed < minSpeed) {
            const scale = minSpeed / speed;
            pos1.vx *= scale;
            pos1.vy *= scale;
          } else if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            pos1.vx *= scale;
            pos1.vy *= scale;
          }
        });

        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]);

  // Don't render videos on mobile
  if (isMobile) return null;

  const getVideoUrl = (video: VideoConfig) => {
    if (video.id === 'aws_video') {
      // Standard looping for AWS video
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=0&showinfo=0&modestbranding=1&start=${video.startTime}&end=${video.endTime}`;
    } else if (video.id === 'meshed_video') {
      // Local video file
      return '/videos/meshed.mov';
    } else {
      // Special approach for 8th wall video
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=0&showinfo=0&modestbranding=1&clip=${video.startTime};${video.endTime}&clipt=${video.startTime};${video.endTime}`;
    }
  };

  return (
    <>
      {VIDEOS.map(video => {
        const position = positions[video.id];
        if (!position) return null;

        return (
          <div
            key={video.id}
            className="fixed pointer-events-none overflow-hidden"
            style={{
              width: video.width,
              height: video.height,
              transform: `translate(${position.x}px, ${position.y}px)`,
              filter: 'blur(0.5px)',
              opacity: 0.7,
            }}
          >
            {video.imageUrl ? (
              <img
                src={video.imageUrl}
                alt="Floating element"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ) : video.id === 'meshed_video' ? (
              <video
                src={getVideoUrl(video)}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ) : video.shouldCrop ? (
              <div 
                style={{
                  width: '100%',
                  height: '400px',
                  transform: `scale(${video.cropScale}) translate(${video.cropTranslate?.x}%, ${video.cropTranslate?.y}%)`,
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={getVideoUrl(video)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={getVideoUrl(video)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default FloatingVideos; 