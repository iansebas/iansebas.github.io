'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Work() {
  const workItems = [
    {
      company: "Niantic Labs",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/Niantic_Logo_2020.png",
      imageWidth: 150,
      imageHeight: 55,
      role: "Computer Vision",
      acquisition: "Acquired by Scopely",
      description: "For half a decade, I led the productization of cutting-edge research by gaining in-depth technical expertise, expanding the technology, integrating it with real use cases in mind, and planning a roadmap for its technical improvement based on cross-collaboration with product, UX, and research. My work successfully launched augmented reality features in Pokémon Go for millions of users, multiple third-party games through our AR SDK, and various spatial computing enterprise projects."
    },
    {
      company: "6D.AI",
      imageUrl: "https://miro.medium.com/v2/resize:fit:1272/format:webp/1*LVg7r9rWgK3T8TptP3QgoA.png",
      imageWidth: 130,
      imageHeight: 45,
      role: "Computer Vision",
      acquisition: "Acquired by Niantic Labs",
      description: "As the fourth employee, I enjoyed wearing many hats and moving fast. I worked closely with Oxford University's Active Vision Lab to create one of the world's first SDKs for real-time 3D reconstruction and Persistent Augmented Reality."
    },
    {
      company: "Civil Maps",
      imageUrl: "https://media.licdn.com/dms/image/v2/C4E0BAQFRjow5bX5IxA/company-logo_200_200/company-logo_200_200/0/1631340322295?e=2147483647&v=beta&t=tihy0S41UegIa1l0gFkqhxQ454TmTw2asz_c2Z_YEyc",
      imageWidth: 110,
      imageHeight: 45,
      role: "Research Engineering",
      acquisition: "Acquired by Luminar",
      description: "I started my career in the Self-Driving Car industry, creating city-scale, high-accuracy 3D Maps for autonomous vehicles"
    },
    {
      company: "Magic Fund",
      imageUrl: "https://i.postimg.cc/mrHqYjbk/magicfundlogo.png",
      imageWidth: 140,
      imageHeight: 45,
      role: "Limited Partner",
      acquisition: "",
      description: "Honored to witness the next rise of the new generation of innovators"
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // No longer needed since we're not using markdown in the descriptions

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

  // Function to format title into parts
  const formatTitle = (title: string) => {
    // For Niantic
    if (title.includes('Niantic Labs')) {
      const company = 'Niantic';
      const role = 'Computer Vision';
      const acquisition = 'Acquired by Scopely';
      return { company, role, acquisition };
    }
    // For 6D.AI
    else if (title.includes('6D.AI')) {
      const company = '6D.AI';
      const role = 'Computer Vision';
      const acquisition = 'Acquired by Niantic Labs';
      return { company, role, acquisition };
    }
    // For Civil Maps
    else if (title.includes('Civil Maps')) {
      const company = 'Civil Maps';
      const role = 'Research Engineering';
      const acquisition = 'Acquired by Luminar';
      return { company, role, acquisition };
    }
    // For Magic Fund
    else if (title.includes('Magic Fund')) {
      const company = 'Magic Fund';
      const role = 'Limited Partner';
      const acquisition = '';
      return { company, role, acquisition };
    }
    // Default fallback
    else {
      return { 
        company: title.split('@')[1]?.trim() || title,
        role: title.split('@')[0]?.trim() || '',
        acquisition: ''
      };
    }
  };

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
            <div className="mb-6">
              <div className="mb-3 relative">
                <Image
                  src={item.imageUrl}
                  alt={item.company}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="text-2xl font-medium text-white/90 text-shadow">{item.role}</h3>
              {item.acquisition && (
                <p className="text-sm font-light text-white/80 italic mt-1">{item.acquisition}</p>
              )}
            </div>
            <p className="text-base text-white/90 text-shadow leading-relaxed">{item.description}</p>
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