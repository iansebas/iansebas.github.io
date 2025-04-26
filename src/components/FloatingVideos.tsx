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
  const [opacity, setOpacity] = useState<Record<string, number>>({});
  const animationFrameRef = useRef<number>();
  const frameCountRef = useRef(0);
  const stuckTimeRef = useRef<Record<string, number>>({});
  const behindTextTimeRef = useRef<Record<string, number>>({});
  const lastFadeTimeRef = useRef<Record<string, number>>({});
  const forceMoveTimerRef = useRef<Record<string, number>>({});
  const SIDEBAR_WIDTH = 256;
  const [isMobile, setIsMobile] = useState(false);
  const [textElements, setTextElements] = useState<DOMRect[]>([]);

  // Initialize opacity state
  useEffect(() => {
    const initialOpacity: Record<string, number> = {};
    const initialStuckTime: Record<string, number> = {};
    const initialBehindTextTime: Record<string, number> = {};
    const initialLastFadeTime: Record<string, number> = {};
    const initialForceMoveTimer: Record<string, number> = {};
    
    VIDEOS.forEach(video => {
      initialOpacity[video.id] = 0.5;
      initialStuckTime[video.id] = 0;
      initialBehindTextTime[video.id] = 0;
      initialLastFadeTime[video.id] = 0;
      initialForceMoveTimer[video.id] = Math.floor(Math.random() * 200);
    });
    
    setOpacity(initialOpacity);
    stuckTimeRef.current = initialStuckTime;
    behindTextTimeRef.current = initialBehindTextTime;
    lastFadeTimeRef.current = initialLastFadeTime;
    forceMoveTimerRef.current = initialForceMoveTimer;
  }, []);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to detect text elements and update their positions
  useEffect(() => {
    const updateTextElements = () => {
      // Get all text elements that need protection
      const elements = document.querySelectorAll('h1, h2, h3, p, a');
      const rects = Array.from(elements).map(el => el.getBoundingClientRect());
      setTextElements(rects);
    };

    // Update text elements positions initially and on scroll/resize
    updateTextElements();
    window.addEventListener('scroll', updateTextElements);
    window.addEventListener('resize', updateTextElements);

    return () => {
      window.removeEventListener('scroll', updateTextElements);
      window.removeEventListener('resize', updateTextElements);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return;

    const initialPositions: Record<string, Position> = {};
    
    // Calculate available space
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - 100;

    // Place videos with initial positions across the entire width
    VIDEOS.forEach((video, index) => {
      // Distribute evenly including behind sidebar
      const xPosition = (index / VIDEOS.length) * availableWidth;
      
      initialPositions[video.id] = {
        x: xPosition,
        y: availableHeight * Math.random(),
        vx: 0.05 * (Math.random() > 0.5 ? 1 : -1), // Faster initial velocity
        vy: 0.04 * (Math.random() > 0.5 ? 1 : -1)  // Faster initial velocity
      };
    });

    setPositions(initialPositions);
    
    const animate = () => {
      frameCountRef.current += 1;
      const currentTime = frameCountRef.current;
      
      setPositions(prev => {
        const next = { ...prev };
        const bounds = {
          left: 0, // Allow behind sidebar
          right: window.innerWidth - 20,
          top: 20,
          bottom: window.innerHeight - 20
        };

        // Process each video independently
        VIDEOS.forEach((video, i) => {
          const videoId = video.id;
          const pos = next[videoId];
          if (!pos) return;
          
          const prevPos = prev[videoId];
          if (!prevPos) return;
          
          // Skip if this element is currently in fade transition
          if (opacity[videoId] < 0.1) return;
          
          // Force movement timer - ensure elements keep moving
          if (forceMoveTimerRef.current[videoId] === undefined) {
            forceMoveTimerRef.current[videoId] = 0;
          }
          
          forceMoveTimerRef.current[videoId]++;
          
          // Periodically force movement in a new direction
          if (forceMoveTimerRef.current[videoId] > 200 + (i * 30)) {
            // Reset timer
            forceMoveTimerRef.current[videoId] = 0;
            
            // Force movement toward appropriate edge
            const goToRight = pos.x < SIDEBAR_WIDTH + 50;
            const goToLeft = pos.x > window.innerWidth - 300;
            
            // Stronger velocity boost
            pos.vx = (goToRight ? 0.06 : (goToLeft ? -0.06 : (Math.random() > 0.5 ? 0.05 : -0.05)));
            pos.vy = (Math.random() - 0.5) * 0.04;
            
            console.log(`Forced new direction for ${videoId}: vx=${pos.vx.toFixed(2)}, vy=${pos.vy.toFixed(2)}`);
          }
          
          // Detect if element is stuck
          const isStuck = Math.abs(pos.x - prevPos.x) < 0.01 && Math.abs(pos.y - prevPos.y) < 0.01;
          
          if (isStuck) {
            stuckTimeRef.current[videoId] = (stuckTimeRef.current[videoId] || 0) + 1;
            
            // If stuck for a short time, try to unstick
            if (stuckTimeRef.current[videoId] > 20) {
              console.log(`Element ${videoId} may be stuck, adding velocity`);
              
              // Random direction boost
              const angle = Math.random() * Math.PI * 2;
              pos.vx = Math.cos(angle) * 0.07;
              pos.vy = Math.sin(angle) * 0.07;
            }
            
            // If still stuck for too long, fade and reposition
            if (stuckTimeRef.current[videoId] > 40) {
              console.log(`Element ${videoId} is definitely stuck, fading out`);
              fadeAndReposition(videoId);
              return;
            }
          } else {
            // Reset stuck counter
            stuckTimeRef.current[videoId] = 0;
          }
          
          // Check if behind text
          let isBehindText = false;
          textElements.forEach(textRect => {
            const videoRect = {
              left: pos.x,
              right: pos.x + video.width,
              top: pos.y,
              bottom: pos.y + video.height
            };

            // Detect text overlap
            if (!(videoRect.right < textRect.left || 
                videoRect.left > textRect.right || 
                videoRect.bottom < textRect.top || 
                videoRect.top > textRect.bottom)) {
              isBehindText = true;
              
              // Stronger push away from text
              const centerX = pos.x + video.width / 2;
              const centerY = pos.y + video.height / 2;
              const textCenterX = textRect.left + textRect.width / 2;
              const textCenterY = textRect.top + textRect.height / 2;
              
              const dx = centerX - textCenterX;
              const dy = centerY - textCenterY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist > 0) {
                pos.vx += (dx / dist) * 0.15;
                pos.vy += (dy / dist) * 0.15;
              }
            }
          });
          
          // Update behind text counter
          if (isBehindText) {
            behindTextTimeRef.current[videoId] = (behindTextTimeRef.current[videoId] || 0) + 1;
            
            // If behind text too long, fade out
            if (behindTextTimeRef.current[videoId] > 60) {
              console.log(`Element ${videoId} behind text too long, fading out`);
              fadeAndReposition(videoId);
              return;
            }
          } else {
            behindTextTimeRef.current[videoId] = 0;
          }
          
          // Wall collisions with more energy
          if (pos.x <= bounds.left || pos.x + video.width >= bounds.right) {
            pos.vx = -pos.vx * 0.9;
            pos.x = pos.x <= bounds.left ? bounds.left + 1 : bounds.right - video.width - 1;
            // Add vertical randomness on horizontal bounce
            pos.vy += (Math.random() - 0.5) * 0.03;
          }
          
          if (pos.y <= bounds.top || pos.y + video.height >= bounds.bottom) {
            pos.vy = -pos.vy * 0.9;
            pos.y = pos.y <= bounds.top ? bounds.top + 1 : bounds.bottom - video.height - 1;
            // Add horizontal randomness on vertical bounce
            pos.vx += (Math.random() - 0.5) * 0.03;
          }
          
          // Apply velocity with minimal damping
          pos.x += pos.vx;
          pos.y += pos.vy;
          pos.vx *= 0.995; // Less damping
          pos.vy *= 0.995;
          
          // Ensure minimum velocity
          const speed = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy);
          if (speed < 0.02) {
            const angle = Math.random() * Math.PI * 2;
            pos.vx = Math.cos(angle) * 0.03;
            pos.vy = Math.sin(angle) * 0.03;
          }
          
          // Keep within bounds
          pos.x = Math.max(bounds.left, Math.min(bounds.right - video.width, pos.x));
          pos.y = Math.max(bounds.top, Math.min(bounds.bottom - video.height, pos.y));
        });
        
        return next;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Helper function to fade out and reposition an element
    const fadeAndReposition = (videoId: string) => {
      // Fade out
      setOpacity(prev => ({
        ...prev,
        [videoId]: 0
      }));
      
      // Reset counters
      stuckTimeRef.current[videoId] = 0;
      behindTextTimeRef.current[videoId] = 0;
      forceMoveTimerRef.current[videoId] = 0;
      lastFadeTimeRef.current[videoId] = frameCountRef.current;
      
      // Reposition after fade
      setTimeout(() => {
        const video = VIDEOS.find(v => v.id === videoId);
        if (!video) return;
        
        // Choose an edge position
        const positionType = Math.floor(Math.random() * 4); // 0: left, 1: right, 2: top, 3: bottom
        let newX, newY, newVx, newVy;
        
        switch (positionType) {
          case 0: // Left (behind sidebar)
            newX = Math.random() * SIDEBAR_WIDTH * 0.8;
            newY = Math.random() * (window.innerHeight - video.height - 40) + 20;
            newVx = 0.04 + Math.random() * 0.03; // Move right
            newVy = (Math.random() - 0.5) * 0.03;
            break;
            
          case 1: // Right
            newX = window.innerWidth - video.width - Math.random() * 100;
            newY = Math.random() * (window.innerHeight - video.height - 40) + 20;
            newVx = -(0.04 + Math.random() * 0.03); // Move left
            newVy = (Math.random() - 0.5) * 0.03;
            break;
            
          case 2: // Top
            newX = SIDEBAR_WIDTH + Math.random() * (window.innerWidth - SIDEBAR_WIDTH - video.width);
            newY = 20 + Math.random() * 50;
            newVx = (Math.random() - 0.5) * 0.04;
            newVy = 0.04 + Math.random() * 0.02; // Move down
            break;
            
          default: // Bottom
            newX = SIDEBAR_WIDTH + Math.random() * (window.innerWidth - SIDEBAR_WIDTH - video.width);
            newY = window.innerHeight - video.height - 20 - Math.random() * 50;
            newVx = (Math.random() - 0.5) * 0.04;
            newVy = -(0.04 + Math.random() * 0.02); // Move up
        }
        
        // Set new position and velocity
        setPositions(prev => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          }
        }));
        
        // Fade back in
        setOpacity(prev => ({
          ...prev,
          [videoId]: 0.5
        }));
        
        console.log(`Repositioned ${videoId} to x:${newX.toFixed(0)}, y:${newY.toFixed(0)}`);
      }, 500);
    };
    
    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile, textElements, opacity]);

  // Don't render videos on mobile
  if (isMobile) return null;

  const getVideoUrl = (video: VideoConfig) => {
    if (video.id === 'aws_video') {
      // Standard looping for AWS video
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=0&showinfo=0&modestbranding=1&start=${video.startTime}&end=${video.endTime}`;
    } else if (video.id === 'meshed_video') {
      // Absolute path to local video file
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
            className="fixed pointer-events-none overflow-hidden transition-opacity duration-300 floating-element"
            style={{
              width: video.width,
              height: video.height,
              transform: `translate(${position.x}px, ${position.y}px)`,
              filter: 'blur(0.5px)',
              opacity: opacity[video.id],
              transition: 'opacity 0.5s ease-in-out, transform 0.3s ease-in-out',
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