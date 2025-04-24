'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoConfig {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
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
    width: 400,
    height: 160,
    shouldCrop: true,
    cropScale: 1.3,
    cropTranslate: { x: -15, y: -15 }
  },
  {
    id: 'eightwall_video',
    videoId: 'yNbjrSomA-M', // 8th Wall video
    // Use a fixed time range - this is simpler for debugging
    startTime: 7,
    endTime: 10,
    width: 300,
    height: 169,
    shouldCrop: false
  }
];

const FloatingVideos: React.FC = () => {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const animationFrameRef = useRef<number>();
  const frameCountRef = useRef(0);
  const SIDEBAR_WIDTH = 256;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize positions on opposite sides to prevent overlap
    const initialPositions: Record<string, Position> = {};
    
    // Calculate available space
    const availableWidth = window.innerWidth - SIDEBAR_WIDTH - 100;
    const availableHeight = window.innerHeight - 100;

    // Place AWS video on the left side
    initialPositions['aws_video'] = {
      x: SIDEBAR_WIDTH + 100,
      y: availableHeight / 4,
      vx: 0.3, // Reduced from 0.6
      vy: 0.2  // Reduced from 0.4
    };

    // Place 8th Wall video on the right side
    initialPositions['eightwall_video'] = {
      x: window.innerWidth - 400,
      y: (availableHeight * 3) / 4,
      vx: -0.3, // Reduced from -0.6
      vy: -0.2  // Reduced from -0.4
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

        // Update each video's position
        VIDEOS.forEach((video1, i) => {
          const pos1 = next[video1.id];
          
          // Wall collisions with stronger bounce
          if (pos1.x <= bounds.left || pos1.x + video1.width >= bounds.right) {
            pos1.vx = -pos1.vx; // Full reflection
            pos1.vy += (Math.random() - 0.5) * 0.4; // Increased variation
          }
          if (pos1.y <= bounds.top || pos1.y + video1.height >= bounds.bottom) {
            pos1.vy = -pos1.vy; // Full reflection
            pos1.vx += (Math.random() - 0.5) * 0.4; // Increased variation
          }

          // Keep within bounds with a margin
          pos1.x = Math.max(bounds.left, Math.min(bounds.right - video1.width, pos1.x));
          pos1.y = Math.max(bounds.top, Math.min(bounds.bottom - video1.height, pos1.y));

          // Check collisions with other videos
          VIDEOS.forEach((video2, j) => {
            if (i >= j) return;
            const pos2 = next[video2.id];

            // Detect collision
            const dx = (pos2.x + video2.width/2) - (pos1.x + video1.width/2);
            const dy = (pos2.y + video2.height/2) - (pos1.y + video1.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = Math.sqrt(
              Math.pow((video1.width + video2.width) / 2, 2) +
              Math.pow((video1.height + video2.height) / 2, 2)
            ) * 0.8;

            if (distance < minDistance) {
              // Simple velocity swap with full energy preservation
              const tempVx = pos1.vx;
              const tempVy = pos1.vy;
              pos1.vx = pos2.vx;
              pos1.vy = pos2.vy;
              pos2.vx = tempVx;
              pos2.vy = tempVy;

              // Add random velocity components to prevent getting stuck
              const randomBoost = 0.3;
              pos1.vx += (Math.random() - 0.5) * randomBoost;
              pos1.vy += (Math.random() - 0.5) * randomBoost;
              pos2.vx += (Math.random() - 0.5) * randomBoost;
              pos2.vy += (Math.random() - 0.5) * randomBoost;

              // Strong push apart
              const pushScale = 1.0;
              const pushX = (dx / distance) * Math.abs(minDistance - distance) * pushScale;
              const pushY = (dy / distance) * Math.abs(minDistance - distance) * pushScale;
              
              pos1.x -= pushX;
              pos1.y -= pushY;
              pos2.x += pushX;
              pos2.y += pushY;
            }
          });

          // Update position
          pos1.x += pos1.vx;
          pos1.y += pos1.vy;

          // Periodic velocity boost
          if (frameCountRef.current % 180 === 0) {
            const speed = Math.sqrt(pos1.vx * pos1.vx + pos1.vy * pos1.vy);
            if (speed < 0.25) { // Reduced from 0.5
              const angle = Math.random() * Math.PI * 2;
              const boost = 0.15; // Reduced from 0.25
              pos1.vx += Math.cos(angle) * boost;
              pos1.vy += Math.sin(angle) * boost;
            }
          }

          // Maintain velocity within bounds
          const speed = Math.sqrt(pos1.vx * pos1.vx + pos1.vy * pos1.vy);
          const minSpeed = 0.2; // Reduced from 0.4
          const maxSpeed = 0.5; // Reduced from 1.0
          
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
  }, []);

  const getVideoUrl = (video: VideoConfig) => {
    if (video.id === 'aws_video') {
      // Standard looping for AWS video
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=0&showinfo=0&modestbranding=1&start=${video.startTime}&end=${video.endTime}`;
    } else {
      // Special approach for 8th wall video
      // Instead of trying to use start/end with looping, use the clip parameter 
      // which is specifically designed for short segments
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
            {video.shouldCrop ? (
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