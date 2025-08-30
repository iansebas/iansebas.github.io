'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

const tags = [
  "ai safety",
  "computer vision",
  "interpretability",
  "self-driving cars",
  "independent research",
  "augmented reality",
];

export default function HomePage() {
  const [currentTagIndex, setCurrentTagIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentTagIndex((prev) => (prev + 1) % tags.length);
        setIsChanging(false);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="h-32 relative">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentTagIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={classNames(
                "text-3xl md:text-6xl font-medium text-white text-shadow absolute inset-0 flex items-center justify-center font-mono tracking-wider text-center md:whitespace-nowrap select-none pointer-events-none",
                isChanging ? "blur-sm" : ""
              )}
              style={{ width: '100%' }}
              tabIndex={-1}
              aria-hidden="true"
            >
              {tags[currentTagIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}