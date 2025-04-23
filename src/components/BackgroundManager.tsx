'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RandomBackground from './RandomBackground';

// Map paths to background images - using full-size images for display
const pathToBackground = {
  '/': [
    '/images/backgrounds/bg0.png',
    '/images/backgrounds/bg1.png',
    '/images/backgrounds/bg2.png',
    '/images/backgrounds/bg3.png'
  ],
  '/work': [
    '/images/backgrounds/bg0.png',
    '/images/backgrounds/bg1.png',
    '/images/backgrounds/bg2.png', 
    '/images/backgrounds/bg3.png'
  ],
  '/contact': [
    '/images/backgrounds/bg0.png',
    '/images/backgrounds/bg2.png',
    '/images/backgrounds/bg3.png'
  ],
  '/writing': [
    '/images/backgrounds/bg0.png',
    '/images/backgrounds/bg1.png'
  ]
};

// Pre-load all background images
const preloadBackgroundImages = () => {
  // Get all unique image paths
  const allImages = new Set<string>();
  Object.values(pathToBackground).forEach(paths => {
    paths.forEach(path => allImages.add(path));
  });
  
  // Also preload the small versions for faster initial loading
  const smallImages = new Set<string>();
  allImages.forEach(path => {
    // Convert regular path to small version
    const smallPath = path.replace('.png', '_small.png');
    smallImages.add(smallPath);
  });
  
  // Preload all background images - first small then full-size
  if (typeof window !== 'undefined') {
    Array.from(smallImages).forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
    
    // Then load the full-size images
    Array.from(allImages).forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }
};

export default function BackgroundManager() {
  const pathname = usePathname();
  
  // Preload all background images once on component mount
  useEffect(() => {
    preloadBackgroundImages();
  }, []);
  
  // Ensure we always have background images for the current path
  const getCurrentBackgroundImages = () => {
    if (pathname && pathname in pathToBackground) {
      return pathToBackground[pathname as keyof typeof pathToBackground];
    }
    return ['/images/backgrounds/bg0.png', '/images/backgrounds/bg1.png'];
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
              key={pathname} // Add key to force remount when pathname changes
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}