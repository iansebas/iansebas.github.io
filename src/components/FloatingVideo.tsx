'use client';

import React, { useEffect, useRef } from 'react';
import { VideoConfig, Position } from './types';

interface FloatingVideoProps {
  video: VideoConfig;
  position: Position;
  isMobile: boolean;
}

interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

const FloatingVideo = ({ video, position, isMobile }: FloatingVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const getVideoUrl = (video: VideoConfig) => {
    if (video.id === 'meshed_video') {
      return '/videos/meshed.mov';
    }
    return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&start=${video.startTime}&end=${video.endTime}&controls=0&showinfo=0&rel=0&modestbranding=1&version=3`;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    // Only do random positioning on desktop
    if (!isMobile) {
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
    } else {
      // On mobile, reset container to top-left to let transform positioning work
      container.style.left = '0px';
      container.style.top = '0px';
    }

    // Add subtle floating animation
    container.style.animation = 'float 40s ease-in-out infinite';
  }, [isMobile]);

  if (!position) return null;

  // Scale down videos on mobile
  const scale = isMobile ? 0.7 : 1;
  const width = video.width * scale;
  const height = video.height * scale;

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none overflow-hidden floating-element"
      style={{
        width,
        height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        filter: 'blur(0.5px)',
        opacity: position.opacity * 0.85,
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
};

export default FloatingVideo; 