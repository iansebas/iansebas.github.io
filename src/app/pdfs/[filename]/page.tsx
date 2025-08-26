export async function generateStaticParams() {
  // Generate static params for known PDF files
  return [
    { filename: 'wanderings.pdf' },
    { filename: 'test-claude.pdf' },
  ];
}

interface Props {
  params: { filename: string };
}

export default function PDFFileRedirect({ params }: Props) {
  const filename = params.filename || '';
  const redirectUrl = `https://www.unrulyabstractions.com/pdfs/${filename}`;

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />
        <title>Redirecting...</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = '${redirectUrl}';`,
          }}
        />
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