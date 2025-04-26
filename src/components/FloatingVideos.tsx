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
  speed: number;
  opacity: number;
}

// Video configurations
const VIDEOS: VideoConfig[] = [
  {
    id: 'aws_video',
    videoId: 'KS12GgvBUIE',
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
    videoId: 'yNbjrSomA-M',
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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Main animation logic
  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return;

    // Function to generate random position with bias towards top or bottom
    const getRandomPosition = (existingPositions: Record<string, Position> = {}) => {
      const screenHeight = window.innerHeight;
      const MIN_VERTICAL_DISTANCE = screenHeight * 0.15; // Minimum distance between items
      const MAX_EDGE_OCCLUSION = 0.2; // Maximum 20% occlusion by screen edges
      const MIDDLE_FIFTH_START = screenHeight * 0.4; // Start of middle fifth
      const MIDDLE_FIFTH_END = screenHeight * 0.6; // End of middle fifth
      
      // Try up to 10 times to find a valid position
      for (let attempt = 0; attempt < 10; attempt++) {
        const random = Math.random();
        let newY;
        
        if (random < 0.5) {
          // 50% chance to be in top section (above middle fifth)
          newY = Math.random() * (MIDDLE_FIFTH_START - MAX_EDGE_OCCLUSION * screenHeight);
        } else {
          // 50% chance to be in bottom section (below middle fifth)
          newY = MIDDLE_FIFTH_END + Math.random() * (screenHeight - MIDDLE_FIFTH_END - MAX_EDGE_OCCLUSION * screenHeight);
        }
        
        // Ensure the item is not too close to the top or bottom edge
        if (newY < MAX_EDGE_OCCLUSION * screenHeight || 
            newY > screenHeight - MAX_EDGE_OCCLUSION * screenHeight) {
          continue;
        }
        
        // Check if this position is far enough from other items
        let isTooClose = false;
        Object.values(existingPositions).forEach(pos => {
          if (Math.abs(pos.y - newY) < MIN_VERTICAL_DISTANCE) {
            isTooClose = true;
          }
        });
        
        if (!isTooClose) {
          return newY;
        }
      }
      
      // If we couldn't find a valid position, return a safe fallback position
      const random = Math.random();
      if (random < 0.5) {
        // Fallback to top section
        return MAX_EDGE_OCCLUSION * screenHeight + Math.random() * (MIDDLE_FIFTH_START - 2 * MAX_EDGE_OCCLUSION * screenHeight);
      } else {
        // Fallback to bottom section
        return MIDDLE_FIFTH_END + Math.random() * (screenHeight - MIDDLE_FIFTH_END - MAX_EDGE_OCCLUSION * screenHeight);
      }
    };

    // Initialize positions with even spacing
    const initialPositions: Record<string, Position> = {};
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    VIDEOS.forEach((video, i) => {
      // Set initial position with path avoidance
      const yPosition = getRandomPosition(initialPositions);
      
      // Set slightly different speeds for each video
      const baseSpeed = 0.3; // Base speed (pixels per frame)
      const speedVariation = 0.1; // Maximum speed difference
      let speed = baseSpeed + (i * speedVariation / VIDEOS.length);
      
      // Special case for meshed video - run at 1/4 speed
      if (video.id === 'meshed_video') {
        speed = speed * 0.25;
      }
      
      initialPositions[video.id] = {
        x: -video.width + (i * screenWidth / VIDEOS.length), // Start evenly spaced
        y: yPosition,
        speed,
        opacity: 1
      };
    });

    setPositions(initialPositions);
    
    const animate = () => {
      setPositions(prev => {
        const next = { ...prev };
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        VIDEOS.forEach(video => {
          const pos = next[video.id];
          if (!pos) return;
          
          // Move right at constant speed
          pos.x += pos.speed;
          
          // Handle fade out and reset
          if (pos.x > screenWidth - video.width) {
            // Start fading out
            pos.opacity = Math.max(0, 1 - (pos.x - (screenWidth - video.width)) / video.width);
            
            // Reset position when fully faded
            if (pos.opacity <= 0) {
              pos.x = -video.width;
              pos.opacity = 0;
              // Generate new random position with path avoidance
              pos.y = getRandomPosition(next);
            }
          } else if (pos.x < 0) {
            // Fade in from left
            pos.opacity = Math.min(1, (pos.x + video.width) / video.width);
          } else {
            // Full opacity in middle
            pos.opacity = 1;
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

  // Don't render on mobile
  if (isMobile) return null;

  const getVideoUrl = (video: VideoConfig) => {
    if (video.id === 'aws_video') {
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=0&showinfo=0&modestbranding=1&start=${video.startTime}&end=${video.endTime}`;
    } else if (video.id === 'meshed_video') {
      return '/videos/meshed.mov';
    } else {
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
            className="fixed pointer-events-none overflow-hidden floating-element"
            style={{
              width: video.width,
              height: video.height,
              transform: `translate(${position.x}px, ${position.y}px)`,
              filter: 'blur(0.5px)',
              opacity: position.opacity,
              transition: 'opacity 0.5s ease-in-out',
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