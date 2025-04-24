import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import BackgroundManager from '@/components/BackgroundManager';
import FloatingVideos from '@/components/FloatingVideos';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ian Rios - Portfolio',
  description: 'Personal portfolio website for Ian Rios, featuring work in Computer Vision, Augmented Reality, and Self-Driving Cars',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`} suppressHydrationWarning={true}>
        <div className="relative flex flex-col md:flex-row min-h-screen overflow-hidden">
          {/* Background images */}
          <BackgroundManager />
          
          {/* Floating YouTube videos */}
          <FloatingVideos />
          
          {/* Fixed background overlay - reduced opacity for better image visibility */}
          <div className="fixed inset-0 -z-10 bg-black/40" />
          
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 md:ml-64 transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}