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
      description: "Honored to be around the coolest people in tech and media"
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoScrollRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const isScrollingUpRef = useRef<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll functionality - disabled on mobile
  useEffect(() => {
    if (!isHovering && !isDragging && containerRef.current && !isMobile) {
      const scrollSpeed = 2; // pixels per frame
      const scrollInterval = 40; // ms between scroll updates
      let lastScrollTime = 0;

      const autoScroll = (timestamp: number) => {
        if (!lastScrollTime) lastScrollTime = timestamp;
        const elapsed = timestamp - lastScrollTime;

        if (elapsed >= scrollInterval) {
          if (containerRef.current) {
            const container = containerRef.current;
            const maxScroll = container.scrollHeight - container.clientHeight;
            
            // Check if we need to change direction
            if (container.scrollTop >= maxScroll - 10) {
              isScrollingUpRef.current = true;
            } else if (container.scrollTop <= 10) {
              isScrollingUpRef.current = false;
            }

            // Scroll in the appropriate direction
            if (isScrollingUpRef.current) {
              container.scrollBy({
                top: -scrollSpeed,
                behavior: 'smooth'
              });
            } else {
              container.scrollBy({
                top: scrollSpeed,
                behavior: 'smooth'
              });
            }
          }
          lastScrollTime = timestamp;
        }

        autoScrollRef.current = requestAnimationFrame(autoScroll);
      };

      autoScrollRef.current = requestAnimationFrame(autoScroll);
    }

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [isHovering, isDragging, isMobile]);

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
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
    if (!isDragging || !isMobile) return;
    const y = e.touches[0].clientY;
    const walk = (startY - y) * 1.5; // Reduced scroll speed multiplier for smoother scrolling
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop + walk;
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    stopDragging();
    setIsHovering(false);
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
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div 
        ref={containerRef}
        className="work-carousel-container overflow-y-auto cursor-grab"
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseUp={!isMobile ? stopDragging : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDragging}
        onMouseEnter={() => !isMobile && setIsHovering(true)}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          height: isMobile ? '85vh' : '75vh',
          scrollPaddingTop: '80px',
          scrollPaddingBottom: '80px',
          paddingTop: '80px',
          paddingBottom: '80px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
          scrollBehavior: 'smooth'
        }}
      >
        <div className="py-12">
          {workItems.map((item, index) => (
            <div 
              key={index}
              className="work-card glass-card max-w-3xl mx-auto mb-16 last:mb-16 opacity-70 hover:opacity-100 transition-opacity"
              style={{ scrollMarginTop: '100px', scrollMarginBottom: '100px' }}
            >
              {item.company === "Niantic Labs" && (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative w-48 h-52 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.company}
                      fill
                      className="object-contain object-left"
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-medium text-white/90 text-shadow">{item.role}</h3>
                    {item.acquisition && (
                      <p className="text-sm font-light text-white/80 italic mt-1">{item.acquisition}</p>
                    )}
                    <p className="text-base text-white/90 text-shadow leading-relaxed mt-2">
                      For half a decade, I led the <strong className="text-white">productization of cutting-edge research</strong> by gaining in-depth technical expertise, expanding the technology, integrating it with real use cases in mind, and planning a roadmap for its technical improvement based on cross-collaboration with product, UX, and research. My work successfully launched <strong className="text-white">augmented reality features in Pokémon Go for millions of users</strong>, multiple third-party games through our AR SDK, and various <strong className="text-white">spatial computing</strong> enterprise projects.
                    </p>
                  </div>
                </div>
              )}
              
              {item.company === "6D.AI" && (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-[400px] h-24 mb-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.company}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="w-full text-center md:text-left">
                    <h3 className="text-2xl font-medium text-white/90 text-shadow">{item.role}</h3>
                    {item.acquisition && (
                      <p className="text-sm font-light text-white/80 italic mt-1">{item.acquisition}</p>
                    )}
                    <p className="text-base text-white/90 text-shadow leading-relaxed mt-2">
                      As the fourth employee, I enjoyed wearing many hats and moving fast. I worked closely with <strong className="text-white">Oxford University's Active Vision Lab</strong> to create one of the world's first SDKs for real-time 3D reconstruction and Persistent Augmented Reality.
                    </p>
                  </div>
                </div>
              )}
              
              {item.company === "Civil Maps" && (
                <div className="flex flex-col md:flex-row-reverse items-center gap-4">
                  <div className="relative w-36 h-28 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.company}
                      fill
                      className="object-contain object-right"
                      priority
                    />
                  </div>
                  <div className="flex-grow text-center md:text-right">
                    <h3 className="text-2xl font-medium text-white/90 text-shadow">{item.role}</h3>
                    {item.acquisition && (
                      <p className="text-sm font-light text-white/80 italic mt-1">{item.acquisition}</p>
                    )}
                    <p className="text-base text-white/90 text-shadow leading-relaxed mt-2">
                      I started my career in the Self-Driving Car industry, creating city-scale, high-accuracy <strong className="text-white">3D Maps for autonomous vehicles</strong>
                    </p>
                  </div>
                </div>
              )}
              
              {item.company === "Magic Fund" && (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative w-48 h-28 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.company}
                      fill
                      className="object-contain object-left"
                      priority
                    />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-medium text-white/90 text-shadow">{item.role}</h3>
                    {item.acquisition && (
                      <p className="text-sm font-light text-white/80 italic mt-1">{item.acquisition}</p>
                    )}
                    <p className="text-base text-white/90 text-shadow leading-relaxed mt-2">{item.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!isMobile && (
          <div className="absolute bottom-8 text-center w-full pointer-events-none">
            <p className="text-sm text-white/70 text-shadow bg-black/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
              Drag to scroll
            </p>
          </div>
        )}
      </div>
    </div>
  );
}