/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Adds trailing slashes to URLs
  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Base path if deploying to GitHub Pages in a repo that's not username.github.io
  // If using username.github.io domain, keep this as empty string
  basePath: '',
};

export default nextConfig;