'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import classNames from 'classnames';

interface WorkItem {
  company: string;
  role: string;
  period: string;
  description: string;
  bgImage: string;
}

interface WorkCarouselProps {
  items: WorkItem[];
  onItemChange?: (bgImage: string) => void;
}

const WorkCarousel = ({ items, onItemChange }: WorkCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // When the current item changes, notify parent (for background image changes)
  useEffect(() => {
    if (onItemChange) {
      onItemChange(items[currentIndex].bgImage);
    }
  }, [currentIndex, items, onItemChange]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative w-full mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-card"
        >
          <h3 className="text-xl font-bold text-white text-shadow">{items[currentIndex].company}</h3>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 mb-4">
            <p className="text-lg text-white/90">{items[currentIndex].role}</p>
            <p className="text-sm text-white/80">{items[currentIndex].period}</p>
          </div>
          <p className="text-white/90">{items[currentIndex].description}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
          aria-label="Previous work experience"
        >
          <FiArrowLeft size={20} />
        </button>
        <div className="flex space-x-2">
          {items.map((_, index) => (
            <div
              key={index}
              className={classNames(
                "h-2 w-2 rounded-full transition-all duration-150",
                index === currentIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
          aria-label="Next work experience"
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WorkCarousel;