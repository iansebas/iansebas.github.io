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

  // Main animation logic
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialPositions: Record<string, Position> = {};
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (isMobile) {
      // On mobile: assign each video a unique vertical lane, randomize horizontal position and speed
      const mobileVideos = VIDEOS.slice(0, 3); // Optionally show fewer videos on mobile
      const laneHeight = screenHeight / (mobileVideos.length + 1);
      mobileVideos.forEach((video, i) => {
        const yPosition = laneHeight * (i + 1) - video.height / 2;
        const minSpeed = 0.4;
        const maxSpeed = 0.8;
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        const startX = -video.width + (Math.random() * (screenWidth + video.width * 2));
        initialPositions[video.id] = {
          x: startX,
          y: yPosition,
          speed,
          opacity: 1
        };
      });
    } else {
      // Desktop logic (unchanged)
      // Shuffle videos array to randomize speeds
      const shuffledVideos = [...VIDEOS].sort(() => Math.random() - 0.5);
      // Calculate vertical segments (5 equal segments)
      const segmentHeight = screenHeight / 5;
      // Determine how many videos go to top vs bottom
      const topCount = Math.ceil(shuffledVideos.length / 2);
      const bottomCount = shuffledVideos.length - topCount;
      shuffledVideos.forEach((video, i) => {
        let yPosition;
        if (i < topCount) {
          // Top segments (first 2 segments)
          const topSpace = segmentHeight * 2;
          const sectionHeight = topSpace / topCount;
          const sectionStart = i * sectionHeight;
          const randomOffset = Math.random() * (sectionHeight * 0.7);
          yPosition = sectionStart + randomOffset;
        } else {
          // Bottom segments (last 2 segments)
          const bottomSpace = segmentHeight * 2;
          const sectionHeight = bottomSpace / bottomCount;
          const bottomIndex = i - topCount;
          const sectionStart = (segmentHeight * 3) + (bottomIndex * sectionHeight); // Start after middle segment
          const randomOffset = Math.random() * (sectionHeight * 0.7);
          yPosition = sectionStart + randomOffset;
        }
        // Randomize speed between 0.6 and 1.4 pixels per frame
        const minSpeed = 0.6;
        const maxSpeed = 1.4;
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        // Distribute initial X positions across the entire screen width plus some offscreen
        const totalWidth = screenWidth + video.width * 2; // Include offscreen areas
        const startX = -video.width + (Math.random() * totalWidth);
        initialPositions[video.id] = {
          x: startX,
          y: yPosition,
          speed,
          opacity: 1
        };
      });
    }

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
            // Reset position to start with a random vertical position in the same region (top or bottom)
            const index = shuffledVideos.findIndex(v => v.id === id);
            let newY;
            if (index < topCount) {
              // Top region
              const topSpace = segmentHeight * 2;
              const sectionHeight = topSpace / topCount;
              const sectionStart = index * sectionHeight;
              const randomOffset = Math.random() * (sectionHeight * 0.7);
              newY = sectionStart + randomOffset;
            } else {
              // Bottom region
              const bottomSpace = segmentHeight * 2;
              const sectionHeight = bottomSpace / bottomCount;
              const bottomIndex = index - topCount;
              const sectionStart = (segmentHeight * 3) + (bottomIndex * sectionHeight);
              const randomOffset = Math.random() * (sectionHeight * 0.7);
              newY = sectionStart + randomOffset;
            }

            newPositions[id] = {
              ...pos,
              x: -video.width,
              y: newY
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
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default FloatingVideos;