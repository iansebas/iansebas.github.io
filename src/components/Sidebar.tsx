'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import classNames from 'classnames';

// Component for randomly selecting a headshot
const RandomHeadshot = () => {
  const [headshot, setHeadshot] = useState('/images/headshots/IMG_8527_small.jpg');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const headshots = [
      '/images/headshots/IMG_8527_small.jpg',
      '/images/headshots/IMG_8530_small.jpg', 
      '/images/headshots/IMG_8531_small.jpg'
    ];
    
    // Preload all headshots
    const preloadPromises = headshots.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
      });
    });
    
    // Once all are loaded, select a random one
    Promise.allSettled(preloadPromises).then(results => {
      const loadedImages = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value);
      
      if (loadedImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * loadedImages.length);
        setHeadshot(loadedImages[randomIndex]);
      }
      setIsLoaded(true);
    });
  }, []);
  
  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-full" />
      )}
      <img 
        src={headshot}
        alt="ian rios" 
        className={`object-cover w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const navItems = [
  { name: 'about', path: '/' },
  { name: 'work', path: '/work' },
  { name: 'writing', path: 'https://iansebas.substack.com/', external: true },
  { name: 'contact', path: '/contact' },
];

const titles = [
  "computer vision",
  "self-driving cars",
  "augmented reality",
  "artificial intelligence"
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Increased interval time to reduce frequency of updates
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setIsChanging(false);
      }, 300);
    }, 5000); // Changed from 3000 to 5000 ms for better performance

    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-black/60 text-white md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar for desktop */}
      <div className={classNames(
        "fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 ease-in-out backdrop-blur-sm",
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="flex flex-col h-full px-8 py-10">
          <div className="mb-8">
            <div className="relative w-20 h-20 mb-4 mx-auto rounded-full overflow-hidden border-2 border-white/70 shadow-lg">
              <RandomHeadshot />
            </div>
            
            <h1 className="text-2xl font-bold text-white text-center text-shadow">ian rios</h1>
            
            <div className="h-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={titleIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={classNames(
                    "text-sm text-white/90 mt-1 text-center text-shadow absolute w-full",
                    isChanging ? "blur-sm" : ""
                  )}
                >
                  {titles[titleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a 
                      href={item.path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative text-lg font-medium text-white text-shadow transition-colors duration-300 hover:text-accent flex justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                      <motion.div 
                        className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all group-hover:w-full"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                    </a>
                  ) : (
                    <Link href={item.path} passHref>
                      <div 
                        className="group relative text-lg font-medium text-white text-shadow transition-colors duration-300 hover:text-accent flex justify-center"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                        <motion.div 
                          className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all group-hover:w-full"
                          initial={false}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto">
            <p className="text-sm text-white/70 text-shadow text-center">© {new Date().getFullYear()} Ian Rios</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;