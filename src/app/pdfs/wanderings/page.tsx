'use client'

import { useEffect } from 'react'

export default function WanderingsRedirect() {
  useEffect(() => {
    // Immediate redirect
    window.location.replace('https://www.unrulyabstractions.com/pdf/wanderings.pdf')
  }, [])

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('https://www.unrulyabstractions.com/pdf/wanderings.pdf');`
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Redirecting to wanderings.pdf...</p>
        <p>If you are not redirected automatically, <a href="https://www.unrulyabstractions.com/pdf/wanderings.pdf">click here</a>.</p>
      </div>
    </>
  )
}