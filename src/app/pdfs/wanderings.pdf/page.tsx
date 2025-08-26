'use client';

import { useEffect } from 'react';

export default function WanderingsPDFRedirect() {
  useEffect(() => {
    window.location.href = 'https://www.unrulyabstractions.com/pdfs/wanderings.pdf';
  }, []);

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=https://www.unrulyabstractions.com/pdfs/wanderings.pdf" />
        <title>Redirecting...</title>
      </head>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          fontFamily: 'Arial, sans-serif' 
        }}>
          <h1>Redirecting...</h1>
          <p>If you are not redirected automatically, please click the link below:</p>
          <a href="https://www.unrulyabstractions.com/pdfs/wanderings.pdf" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            https://www.unrulyabstractions.com/pdfs/wanderings.pdf
          </a>
        </div>
      </body>
    </html>
  );
}