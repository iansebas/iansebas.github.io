'use client';

import Section from '@/components/Section';
import { useEffect, useState } from 'react';

// Component for randomly selecting a headshot
const RandomHeadshot = ({ size = 256 }: { size?: number }) => {
  const [headshot, setHeadshot] = useState('/images/headshot1.jpg');
  
  useEffect(() => {
    const headshots = [
      '/images/headshots/IMG_8527.JPG',
      '/images/headshots/IMG_8530.JPG', 
      '/images/headshots/IMG_8531.JPG'
    ];
    const randomIndex = Math.floor(Math.random() * headshots.length);
    setHeadshot(headshots[randomIndex]);
  }, []);
  
  return (
    <img 
      src={headshot}
      alt="ian rios" 
      className="object-cover w-full h-full"
      style={{ objectPosition: 'center' }}
    />
  );
};

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
        <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-white/50 shadow-xl">
            <RandomHeadshot />
          </div>
        </div>
        
        <div className="w-full md:w-2/3 bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-8">
          <p className="text-lg mb-6 text-white text-shadow leading-relaxed tracking-wide">
            Curiosity pulls me in. Impact keeps me grounded.
          </p>
          <p className="text-lg mb-6 text-white text-shadow leading-relaxed tracking-wide">
            I am a technologist who moves through opacity, not around it. From <span className="font-semibold">self-driving cars</span> to <span className="font-semibold">augmented reality</span>, I build toward possibilities not yet fully seen but already taking shape.
          </p>
          <p className="text-lg text-white text-shadow leading-relaxed tracking-wide">
            Let's have fun creating the future together.
          </p>
        </div>
      </div>
    </div>
  );
}