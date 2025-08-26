'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PDFRedirect() {
  const params = useParams();
  
  useEffect(() => {
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || '';
    const redirectUrl = `https://www.unrulyabstractions.com/pdfs/${slug}`;
    
    // Immediate redirect
    window.location.href = redirectUrl;
  }, [params.slug]);

  // Fallback HTML meta redirect and message
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || '';
  const redirectUrl = `https://www.unrulyabstractions.com/pdfs/${slug}`;

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />
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
          <a href={redirectUrl} style={{ color: '#0070f3', textDecoration: 'underline' }}>
            {redirectUrl}
          </a>
        </div>
      </body>
    </html>
  );
}