'use client';

import { useEffect } from 'react';

export default function Resume() {
  useEffect(() => {
    // Redirect directly to the PDF file
    window.location.replace('/resume_ian_rios.pdf');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white text-shadow mb-4">Loading Resume...</h1>
        <p className="text-white/70">
          Redirecting to PDF. If it doesn't load automatically,{' '}
          <a
            href="/resume_ian_rios.pdf"
            className="text-white underline hover:text-white/80"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}