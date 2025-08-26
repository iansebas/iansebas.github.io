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
        <style>{`
          body { 
            margin: 0; 
            padding: 0; 
            background: #000; 
            color: #fff; 
            font-family: Arial, sans-serif; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
          }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate redirect with no delay
              window.location.replace('${redirectUrl}');
            `,
          }}
        />
      </head>
      <body>
        <div>
          <h1>Redirecting...</h1>
        </div>
      </body>
    </html>
  );
}