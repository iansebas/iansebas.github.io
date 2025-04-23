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
    <Section title="let's connect">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/50 shadow-lg mb-8">
          <RandomHeadshot size={128} />
        </div>
        
        <p className="text-xl mb-8 max-w-2xl text-shadow">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          {/* Resume Button */}
          <a 
            href="/resume_ian_rios.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card flex flex-col items-center transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full mb-4">
              <FiFileText size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white text-shadow">resume</h3>
            <p className="text-sm text-white/80">view my detailed experience</p>
          </a>
          
          {/* Email Button */}
          <a 
            href="mailto:iansebas@umich.edu"
            className="glass-card flex flex-col items-center transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full mb-4">
              <FiMail size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white text-shadow">email</h3>
            <p className="text-sm text-white/80">iansebas@umich.edu</p>
          </a>
          
          {/* LinkedIn Button */}
          <a 
            href="https://www.linkedin.com/in/iansebas/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card flex flex-col items-center transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full mb-4">
              <FiLinkedin size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white text-shadow">linkedin</h3>
            <p className="text-sm text-white/80">connect with me</p>
          </a>
        </div>
      </div>
    </Section>
  );
}