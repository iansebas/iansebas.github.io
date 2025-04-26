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
    
    // YouTube embed URL
    return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&start=${video.startTime}&end=${video.endTime}&controls=0&showinfo=0&rel=0&modestbranding=1&version=3`;
  };
  
  // Get direct video URL for mobile (using poster images instead of YouTube embeds)
  const getVideoPoster = (video: VideoConfig) => {
    if (video.id === 'aws_video') {
      return "https://img.youtube.com/vi/KS12GgvBUIE/hqdefault.jpg";
    } else if (video.id === 'eightwall_video') {
      return "https://img.youtube.com/vi/yNbjrSomA-M/hqdefault.jpg";
    } 
    return "";
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
        // Image - same for mobile and desktop
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
        // Video file - same for mobile and desktop
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
      ) : isMobile ? (
        // On mobile: use poster images for YouTube videos to avoid iframe issues
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#000',
          }}
        >
          <img
            src={getVideoPoster(video)}
            alt={`Video thumbnail - ${video.id}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
            }}
          />
        </div>
      ) : video.shouldCrop ? (
        // Desktop: YouTube with crop
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
        // Desktop: YouTube without crop
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