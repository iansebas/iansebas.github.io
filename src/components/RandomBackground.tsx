'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface RandomBackgroundProps {
  images: string[];
  isMobile?: boolean;
}

const RandomBackground = ({ images, isMobile = false }: RandomBackgroundProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const preloadedImages = useRef<string[]>([]);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Preload all images on mount
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    // Choose a random image to start with
    const randomIndex = Math.floor(Math.random() * images.length);
    setImageIndex(randomIndex);
    
    // Create an array of promises to preload all images
    const preloadPromises = images.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        // On mobile, use a lower quality version if available
        const mobileSrc = isMobile ? src.replace('.png', '_mobile.png') : src;
        img.src = mobileSrc;
        img.onload = () => resolve(mobileSrc);
        img.onerror = () => {
          // Fallback to original image if mobile version fails
          if (isMobile) {
            const fallbackImg = new window.Image();
            fallbackImg.src = src;
            fallbackImg.onload = () => resolve(src);
            fallbackImg.onerror = () => reject(new Error(`Failed to load ${src}`));
          } else {
            reject(new Error(`Failed to load ${src}`));
          }
        };
      });
    });
    
    // Collect all successfully loaded images
    Promise.allSettled(preloadPromises).then(results => {
      const loadedImages = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value);
      
      preloadedImages.current = loadedImages;
      
      if (loadedImages.length > 0) {
        // Use the random index if that image loaded successfully, otherwise use the first loaded image
        const initialImage = loadedImages.includes(images[randomIndex]) 
          ? images[randomIndex] 
          : loadedImages[0];
        
        setBackgroundImage(initialImage);
        setLoaded(true);
      } else {
        console.error("All images failed to load");
        setLoaded(true); // Still set loaded to true to show fallback
      }
    });
    
    // Clean up any existing interval when images prop changes
    return () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
    };
  }, [images, isMobile]);

  // Set up cycling through images
  useEffect(() => {
    if (!loaded || preloadedImages.current.length <= 1) return;
    
    // On mobile, don't cycle images to save resources
    if (isMobile) return;
    
    // Start cycling images after initial load
    cycleTimerRef.current = setInterval(() => {
      setImageIndex(prevIndex => {
        // Find the next valid index with a successfully loaded image
        let nextIndex = (prevIndex + 1) % images.length;
        let attempts = 0;
        
        // Try to find a valid image, but limit attempts to avoid infinite loop
        while (!preloadedImages.current.includes(images[nextIndex]) && attempts < images.length) {
          nextIndex = (nextIndex + 1) % images.length;
          attempts++;
        }
        
        if (preloadedImages.current.includes(images[nextIndex])) {
          setBackgroundImage(images[nextIndex]);
          return nextIndex;
        }
        
        return prevIndex; // If no valid image found, keep current index
      });
    }, 30000); // Change every 30 seconds (increased from 15 to reduce CPU usage)
    
    return () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
    };
  }, [loaded, images, isMobile]);

  // Handle background rendering based on state
  if (!loaded || !backgroundImage) {
    // If we have a preloaded image, show it during initial load
    if (preloadedImages.current.length > 0) {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: `url(${preloadedImages.current[0]})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            // On mobile, use a simpler transform for better performance
            transform: isMobile ? 'none' : 'translate3d(0,0,0)'
          }}
        />
      );
    }
    // Pastel egg-rose-pink-white gradient as fallback if no images available
    return <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-200 to-white" />;
  }

  // Main background with loaded image
  return (
    <motion.div
      key={backgroundImage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        // On mobile, use a simpler transform for better performance
        transform: isMobile ? 'none' : 'translate3d(0,0,0)'
      }}
    />
  );
};

export default RandomBackground;