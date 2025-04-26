'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function AboutPage() {
  const [highResLoaded, setHighResLoaded] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
        <div className="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-white/50 shadow-xl">
            {/* Low-res blurred placeholder */}
            <Image
              src="/images/headshots/IMG_8527_small.jpg"
              alt="ian rios low-res"
              fill
              className={`object-cover absolute inset-0 w-full h-full transition-opacity duration-500 ${highResLoaded ? 'opacity-0' : 'opacity-100 blur-md scale-105'}`}
              style={{ objectPosition: 'center' }}
              draggable={false}
              priority
            />
            {/* High-res image fades in over low-res */}
            <Image
              src="/images/headshots/IMG_8527.JPG"
              alt="ian rios"
              fill
              className={`object-cover absolute inset-0 w-full h-full transition-opacity duration-500 ${highResLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ objectPosition: 'center' }}
              onLoad={() => setHighResLoaded(true)}
              draggable={false}
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-2/3 bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-8">
          <p className="text-lg mb-6 text-white text-shadow leading-relaxed tracking-wide">
            Curiosity pulls me in. Impact keeps me grounded.
          </p>
          <p className="text-lg mb-6 text-white text-shadow leading-relaxed tracking-wide">
            I am a technologist who moves through opacity, not around it. From{' '}
            <span className="font-semibold">self-driving cars</span> to{' '}
            <span className="font-semibold">augmented reality</span>, I build toward possibilities not yet fully seen but already taking shape.
          </p>
          <p className="text-lg mb-8 text-white text-shadow leading-relaxed tracking-wide">
            Let's have fun creating the future together.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">things i have enjoyed doing:</h2>
              <ul className="list-disc list-inside space-y-2 text-white">
                <li>productizing cutting-edge research technology</li>
                <li>building complex ai engineering systems</li>
                <li>leading and growing people</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">things i want to do more of:</h2>
              <ul className="list-disc list-inside space-y-2 text-white">
                <li>ai interpretability + alignment</li>
                <li>new foundation models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 