'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BackgroundManager() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-20">
      <picture className="absolute inset-0">
        <source
          media="(max-width: 768px)"
          srcSet="/images/backgrounds/bg1_small.png"
        />
        <Image
          src="/images/backgrounds/bg1.png"
          alt="Background"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover blur-sm"
          style={{
            transform: 'translate3d(0, 0, 0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        />
      </picture>
    </div>
  );
}