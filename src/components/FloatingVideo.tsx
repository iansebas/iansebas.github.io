'use client';

import React, { useEffect, useRef } from 'react';

interface FloatingVideoProps {
  videoId: string;
  startTime: number;
  endTime: number;
}

interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

const FloatingVideo: React.FC<FloatingVideoProps> = ({ videoId, startTime, endTime }) => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const SIDEBAR_WIDTH = 256; // 16rem = 256px

    // Calculate safe zones (right side of main content)
    const safeZones: SafeZone[] = [
      // Main content area (middle-right)
      { 
        x: SIDEBAR_WIDTH + (window.innerWidth - SIDEBAR_WIDTH) * 0.3, 
        y: window.innerHeight * 0.2, // Start 20% from top
        width: (window.innerWidth - SIDEBAR_WIDTH) * 0.7, 
        height: window.innerHeight * 0.6 // Use middle 60% of height
      }
    ];

    // Always use the main right area
    const randomZone = safeZones[0];
    
    // Calculate random position within the safe zone
    const randomX = randomZone.x + Math.random() * (randomZone.width - 300);
    const randomY = randomZone.y + Math.random() * (randomZone.height - 150);
    
    container.style.left = `${randomX}px`;
    container.style.top = `${randomY}px`;

    // Add subtle floating animation
    container.style.animation = 'float 40s ease-in-out infinite';
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed w-[400px] pointer-events-none overflow-hidden"
      style={{
        transform: 'translate(-50%, -50%)',
        filter: 'blur(0.5px)',
        opacity: 0.7,
        height: '160px', // Smaller height for less intrusive appearance
      }}
    >
      <div 
        style={{
          width: '100%',
          height: '400px', // Taller container for scaling
          transform: 'scale(1.3) translate(-15%, -15%)', // Scale up and shift to show more of the right side
        }}
      >
        <iframe
          ref={videoRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&start=50&end=180&controls=0&showinfo=0&rel=0&modestbranding=1&version=3`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            border: 'none',
            borderRadius: 0,
          }}
        />
      </div>
    </div>
  );
};

export default FloatingVideo; 