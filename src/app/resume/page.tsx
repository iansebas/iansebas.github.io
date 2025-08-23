'use client';

import { useEffect, useState } from 'react';

export default function Resume() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    // Refresh the PDF on every page visit
    setRefreshKey(Date.now());
  }, []);

  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white text-shadow">Resume</h1>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Refresh
            </button>
            <a
              href={`/resume_ian_rios.pdf?t=${refreshKey}`}
              download="Ian_Rios_Resume.pdf"
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ height: '80vh' }}>
          <iframe
            src={`/resume_ian_rios.pdf?t=${refreshKey}#view=FitH`}
            width="100%"
            height="100%"
            className="border-0"
            title="Ian Rios Resume"
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-white/70 text-sm">
            If the PDF doesn't display, you can{' '}
            <a
              href={`/resume_ian_rios.pdf?t=${refreshKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-white/80"
            >
              open it in a new tab
            </a>{' '}
            or{' '}
            <a
              href={`/resume_ian_rios.pdf?t=${refreshKey}`}
              download="Ian_Rios_Resume.pdf"
              className="text-white underline hover:text-white/80"
            >
              download it directly
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}