'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Work() {
  const workItems = [
    {
      title: "Computer Vision @ Niantic Labs (Acquired by Scopely)",
      description: "For half a decade, I led the productization of cutting-edge research by gaining in-depth technical expertise, expanding the technology, integrating it with real use cases in mind, and planning a roadmap for its technical improvement based on cross-collaboration with product, UX, and research. My work successfully launched **Augmented Reality** features in **Pokémon Go** for millions of users, multiple third-party games through our **AR SDK**, and various **spatial computing** enterprise projects."
    },
    {
      title: "Computer Vision @ 6D.AI (Acquired by Niantic Labs)",
      description: "As the fourth employee, I enjoyed wearing many hats and moving fast. I worked closely with **Oxford University's Active Vision Lab** to create one of the world's first SDKs for **real-time 3D reconstruction** and **Persistent Augmented Reality**."
    },
    {
      title: "Research Engineering @ Civil Maps (Acquired by Luminar)",
      description: "As the fourth employee, I enjoyed wearing many hats and moving fast. I worked closely with Oxford University's Active Vision Lab to create one of the world's first SDKs for **real-time 3D reconstruction** and **Persistent Augmented Reality**."
    },
    {
      title: "Limited Partner @ Magic Fund",
      description: "Honored to witness the next rise of the new generation of **innovators**."
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const formatDescription = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const y = e.clientY;
    const walk = (startY - y) * 2; // Scroll speed multiplier
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop + walk;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    // Note: removed e.preventDefault() as it causes issues on some mobile browsers
    const y = e.touches[0].clientY;
    const walk = (startY - y) * 1.5; // Reduced scroll speed multiplier for smoother scrolling
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop + walk;
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  // Add event listeners only once when component mounts
  useEffect(() => {
    const handleStopDragging = () => setIsDragging(false);
    
    document.addEventListener('mouseup', handleStopDragging);
    document.addEventListener('touchend', handleStopDragging);
    
    return () => {
      document.removeEventListener('mouseup', handleStopDragging);
      document.removeEventListener('touchend', handleStopDragging);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div 
        ref={containerRef}
        className="work-carousel-container max-h-[70vh] overflow-y-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDragging}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {workItems.map((item, index) => (
          <div 
            key={index}
            className="work-card glass-card max-w-3xl mx-auto mb-10 last:mb-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <h2 className="text-xl font-medium text-white text-shadow mb-4">{item.title}</h2>
            <p 
              className="text-white/90 text-shadow" 
              dangerouslySetInnerHTML={{ __html: formatDescription(item.description) }}
            />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-8 text-center w-full pointer-events-none">
        <p className="text-sm text-white/70 text-shadow bg-black/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
          Drag to scroll
        </p>
      </div>
    </div>
  );
}