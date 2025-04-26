'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RandomBackground from './RandomBackground';

// Map paths to background images - using full-size images for display
const pathToBackground = {
  '/': [
    '/images/backgrounds/bg0_mobile.png',
    '/images/backgrounds/bg1_mobile.png',
    '/images/backgrounds/bg2_mobile.png',
    '/images/backgrounds/bg3_mobile.png'
  ],
  '/work': [
    '/images/backgrounds/bg0_mobile.png',
    '/images/backgrounds/bg1_mobile.png',
    '/images/backgrounds/bg2_mobile.png', 
    '/images/backgrounds/bg3_mobile.png'
  ],
  '/contact': [
    '/images/backgrounds/bg0_mobile.png',
    '/images/backgrounds/bg2_mobile.png',
    '/images/backgrounds/bg3_mobile.png'
  ],
  '/writing': [
    '/images/backgrounds/bg0_mobile.png',
    '/images/backgrounds/bg1_mobile.png'
  ]
};

// Pre-load background images with lazy loading
const preloadBackgroundImages = (isMobile: boolean) => {
  if (typeof window === 'undefined') return;

  // Get all unique image paths
  const allImages = new Set<string>();
  Object.values(pathToBackground).forEach(paths => {
    paths.forEach(path => {
      // Use mobile versions for mobile devices
      const imagePath = isMobile ? path : path.replace('_mobile.png', '.png');
      allImages.add(imagePath);
    });
  });
  
  // Create an Intersection Observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  // Preload images with lazy loading
  Array.from(allImages).forEach(src => {
    const img = new window.Image();
    img.dataset.src = src;
    observer.observe(img);
  });
};

export default function BackgroundManager() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload background images when device type changes
  useEffect(() => {
    preloadBackgroundImages(isMobile);
  }, [isMobile]);
  
  // Ensure we always have background images for the current path
  const getCurrentBackgroundImages = () => {
    if (pathname && pathname in pathToBackground) {
      const images = pathToBackground[pathname as keyof typeof pathToBackground];
      // On mobile, only use the first image to reduce memory usage
      return isMobile ? [images[0]] : images.map(img => img.replace('_mobile.png', '.png'));
    }
    return ['/images/backgrounds/bg0_mobile.png', '/images/backgrounds/bg1_mobile.png'];
  };

  return (
    <div className="fixed inset-0 -z-20">
      {/* Fallback gradient background with pastel rose-pink tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-200 to-white"></div>
      <AnimatePresence mode="wait">
        {pathname && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <RandomBackground 
              images={getCurrentBackgroundImages()} 
              key={pathname}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}