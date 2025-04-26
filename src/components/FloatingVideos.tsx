'use client';

import React, { useEffect, useRef, useState } from 'react';
import FloatingVideo from './FloatingVideo';
import { VideoConfig, Position } from './types';

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

  // Main animation logic - disabled on mobile
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

    // Animation loop
    const animate = () => {
      setPositions(prevPositions => {
        const newPositions = { ...prevPositions };
        let needsUpdate = false;

        Object.entries(newPositions).forEach(([id, pos]) => {
          const video = VIDEOS.find(v => v.id === id);
          if (!video) return;

          // Update position
          const newX = pos.x + pos.speed;
          const maxX = window.innerWidth + video.width;

          if (newX > maxX) {
            // Reset position to start
            newPositions[id] = {
              ...pos,
              x: -video.width,
              y: getRandomPosition(newPositions)
            };
          } else {
            newPositions[id] = {
              ...pos,
              x: newX
            };
          }
          needsUpdate = true;
        });

        return needsUpdate ? newPositions : prevPositions;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]);

  // Don't render anything on mobile
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {VIDEOS.map(video => (
        <FloatingVideo
          key={video.id}
          video={video}
          position={positions[video.id]}
        />
      ))}
    </div>
  );
};

export default FloatingVideos;