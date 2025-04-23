'use client';

import Section from '@/components/Section';
import { FiFileText, FiMail, FiLinkedin } from 'react-icons/fi';
import { useEffect, useState } from 'react';

// Component for randomly selecting a headshot
const RandomHeadshot = ({ size = 128 }: { size?: number }) => {
  const [headshot, setHeadshot] = useState('/images/headshot1.jpg');
  
  useEffect(() => {
    const headshots = [
      '/images/headshots/IMG_8527_small.jpg',
      '/images/headshots/IMG_8530_small.jpg', 
      '/images/headshots/IMG_8531_small.jpg'
    ];
    const randomIndex = Math.floor(Math.random() * headshots.length);
    setHeadshot(headshots[randomIndex]);
  }, []);
  
  return (
    <img 
      src={headshot}
      alt="ian rios" 
      width={size}
      height={size}
      className="object-cover w-full h-full"
      style={{ objectPosition: 'center' }}
    />
  );
};

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex justify-center gap-28 w-full max-w-6xl">
        {/* Resume Link */}
        <a 
          href="/resume_ian_rios.pdf" 
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 hover:transform hover:scale-110"
        >
          <h2 className="text-6xl font-bold text-white text-shadow tracking-wide">resume</h2>
        </a>
        
        {/* Email Link */}
        <a 
          href="mailto:iansebas@umich.edu"
          className="transition-all duration-300 hover:transform hover:scale-110"
        >
          <h2 className="text-6xl font-bold text-white text-shadow tracking-wide">email</h2>
        </a>
        
        {/* LinkedIn Link */}
        <a 
          href="https://www.linkedin.com/in/iansebas/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 hover:transform hover:scale-110"
        >
          <h2 className="text-6xl font-bold text-white text-shadow tracking-wide">linkedin</h2>
        </a>
      </div>
    </div>
  );
}