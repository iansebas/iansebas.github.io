import { redirect } from 'next/navigation'

export default function WanderingsPDFRedirect() {
  // For external redirects in static export, we need client-side redirect
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=https://unrulyabstractions.com" />
        <script dangerouslySetInnerHTML={{
          __html: `window.location.href = 'https://unrulyabstractions.com';`
        }} />
      </head>
      <body>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              animation: 'spin 1s linear infinite',
              borderRadius: '50%',
              height: '48px',
              width: '48px',
              border: '2px solid transparent',
              borderTop: '2px solid #000',
              margin: '0 auto 16px'
            }}></div>
            <p>Redirecting to Unruly Abstractions...</p>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
        }} />
      </body>
    </html>
  )
}