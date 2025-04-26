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

// Mobile-only component with completely separate logic
const MobileFloatingVideos = () => {
  // Hardcoded positions for each video on mobile
  const videoPositions = [
    { top: '20%', left: '-100px', animationDelay: '0s', speed: 15 },
    { top: '40%', left: '-100px', animationDelay: '5s', speed: 12 },
    { top: '60%', left: '-100px', animationDelay: '2s', speed: 18 },
    { top: '80%', left: '-100px', animationDelay: '8s', speed: 10 }
  ];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {VIDEOS.map((video, index) => (
        <div 
          key={video.id}
          className="fixed pointer-events-none"
          style={{
            top: videoPositions[index].top,
            width: video.width * 0.6,
            height: video.height * 0.6,
            animation: `mobileFloat ${videoPositions[index].speed}s linear infinite`,
            animationDelay: videoPositions[index].animationDelay,
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
              src="/videos/meshed.mov"
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
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#000',
            }}>
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={`Video thumbnail - ${video.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 0, 0.7)',
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Desktop FloatingVideos
const DesktopFloatingVideos = () => {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const animationFrameRef = useRef<number>();
  
  // This is the original desktop-only implementation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialPositions: Record<string, Position> = {};
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Desktop logic (unchanged)
    const shuffledVideos = [...VIDEOS].sort(() => Math.random() - 0.5);
    const segmentHeight = screenHeight / 5;
    const topCount = Math.ceil(shuffledVideos.length / 2);
    const bottomCount = shuffledVideos.length - topCount;
    shuffledVideos.forEach((video, i) => {
      let yPosition;
      if (i < topCount) {
        const topSpace = segmentHeight * 2;
        const sectionHeight = topSpace / topCount;
        const sectionStart = i * sectionHeight;
        const randomOffset = Math.random() * (sectionHeight * 0.7);
        yPosition = sectionStart + randomOffset;
      } else {
        const bottomSpace = segmentHeight * 2;
        const sectionHeight = bottomSpace / bottomCount;
        const bottomIndex = i - topCount;
        const sectionStart = (segmentHeight * 3) + (bottomIndex * sectionHeight);
        const randomOffset = Math.random() * (sectionHeight * 0.7);
        yPosition = sectionStart + randomOffset;
      }
      const minSpeed = 0.6;
      const maxSpeed = 1.4;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const totalWidth = screenWidth + video.width * 2;
      const startX = -video.width + (Math.random() * totalWidth);
      initialPositions[video.id] = {
        x: startX,
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

        // Desktop logic
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
            const index = shuffledVideos.findIndex(v => v.id === id);
            let newY;
            if (index < topCount) {
              const topSpace = segmentHeight * 2;
              const sectionHeight = topSpace / topCount;
              const sectionStart = index * sectionHeight;
              const randomOffset = Math.random() * (sectionHeight * 0.7);
              newY = sectionStart + randomOffset;
            } else {
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
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {VIDEOS.map(video => (
        <FloatingVideo
          key={video.id}
          video={video}
          position={positions[video.id]}
          isMobile={false}
        />
      ))}
    </div>
  );
};

// Main component that chooses mobile or desktop
const FloatingVideos: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create mobile float animation via CSS keyframes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes mobileFloat {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
      `;
      document.head.appendChild(styleSheet);
      return () => {
        document.head.removeChild(styleSheet);
      };
    }
  }, []);

  // Completely separate implementations for mobile and desktop
  return isMobile ? <MobileFloatingVideos /> : <DesktopFloatingVideos />;
};

export default FloatingVideos;