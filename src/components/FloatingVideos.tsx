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
      // On mobile: use ALL videos with strict vertical spacing
      const mobileScale = 0.6; // Even smaller on mobile
      const mobileVideos = VIDEOS; // Use all videos
      
      // Create 4 evenly-spaced lanes - more spacing between them
      const totalVideos = mobileVideos.length;
      const lanePositions = Array(totalVideos).fill(0).map((_, i) => 
        (i + 1) * (screenHeight / (totalVideos + 1))
      );
      
      mobileVideos.forEach((video, i) => {
        const widthScaled = video.width * mobileScale;
        const heightScaled = video.height * mobileScale;
        const yPosition = lanePositions[i] - heightScaled / 2;
        
        // Stagger the horizontal positions so they don't start at the same x
        const positionOffset = i * (screenWidth / 4);
        const minSpeed = 0.3 + (i * 0.1); // Different speeds for each video
        const maxSpeed = 0.6 + (i * 0.1);
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        const startX = positionOffset - widthScaled;
        
        initialPositions[video.id] = {
          x: startX,
          y: yPosition,
          speed,
          opacity: 1
        };
      });
    } else {
      // Desktop logic (unchanged)
      const shuffledVideos = [...VIDEOS].sort(() => Math.random() - 0.5);
      const segmentHeight = screenHeight / 5;
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

        if (isMobile) {
          const mobileScale = 0.6;
          const mobileVideos = VIDEOS; // Use all videos
          
          // Create lanes again in animation loop to ensure consistency
          const totalVideos = mobileVideos.length;
          const lanePositions = Array(totalVideos).fill(0).map((_, i) => 
            (i + 1) * (window.innerHeight / (totalVideos + 1))
          );
          
          mobileVideos.forEach((video, i) => {
            const pos = newPositions[video.id];
            if (!pos) return;
            
            const widthScaled = video.width * mobileScale;
            const heightScaled = video.height * mobileScale;
            const newX = pos.x + pos.speed;
            const maxX = window.innerWidth;
            
            if (newX > maxX) {
              // Reset to left side while strictly maintaining lane position
              newPositions[video.id] = { 
                ...pos, 
                x: -widthScaled,
                y: lanePositions[i] - heightScaled / 2
              };
            } else {
              // Always enforce correct Y position each frame
              newPositions[video.id] = { 
                ...pos, 
                x: newX,
                y: lanePositions[i] - heightScaled / 2
              };
            }
            needsUpdate = true;
          });
        } else {
          // Desktop logic (unchanged)
          const shuffledVideos = [...VIDEOS].sort(() => Math.random() - 0.5);
          const screenHeight = window.innerHeight;
          const segmentHeight = screenHeight / 5;
          const topCount = Math.ceil(shuffledVideos.length / 2);
          const bottomCount = shuffledVideos.length - topCount;
          Object.entries(newPositions).forEach(([id, pos]) => {
            const video = VIDEOS.find(v => v.id === id);
            if (!video) return;
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
        }
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