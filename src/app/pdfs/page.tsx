'use client';

import { useEffect } from 'react';

export default function PDFRedirect() {
  useEffect(() => {
    // Redirect to the main PDFs directory
    window.location.href = 'https://www.unrulyabstractions.com/pdfs/';
  }, []);

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=https://www.unrulyabstractions.com/pdfs/" />
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
          <a href="https://www.unrulyabstractions.com/pdfs/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            https://www.unrulyabstractions.com/pdfs/
          </a>
        </div>
      </body>
    </html>
  );
}