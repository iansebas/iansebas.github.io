# Ian Rios - Portfolio

A modern, responsive portfolio website built with Next.js, React, and Tailwind CSS.

## Features

- Responsive design that works on mobile and desktop
- Side navigation with dynamic text rotating between specialties
- 3D floating work experience carousel
- Full-screen background images with smooth transitions
- Optimized for performance and mobile devices
- Contact links to LinkedIn, email, and resume
- Blog link to Substack

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the result

## Deployment to GitHub Pages

1. The site is configured for static export with Next.js
2. Run the build command to generate static files:
   ```bash
   npm run build
   ```
3. The static files will be in the `out` directory
4. Deploy to GitHub Pages by pushing to your repository

## Folder Structure

```
/
├── public/              # Static assets
│   ├── images/          # Images for the portfolio
│   └── resources/       # PDF files like resume
├── src/                 # Source code
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   └── styles/          # CSS styles
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.mjs      # Next.js configuration
└── README.md            # This file
```

## Customization

To update content or make changes to the portfolio:

1. Edit the component files in `src/components/`
2. Update images in the `public/images/` directory
3. Modify styles in `src/styles/` or using Tailwind classes

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [ClassNames](https://github.com/JedWatson/classnames) - Utility for conditionally joining class names