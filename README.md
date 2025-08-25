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

## Deployment

**⚠️ CRITICAL: DEPLOYMENT PROCESS DOCUMENTATION ⚠️**

**WORKING DEPLOYMENT PROCESS** (Verified Aug 25, 2025):

To deploy to GitHub Pages (pushes code AND deploys), use:

```bash
./deploy.sh
```

**CRITICAL TECHNICAL DETAILS:**

This script will:
1. Add and commit all changes to `master` branch
2. Push changes to GitHub
3. Build the Next.js project with static export (`npm run build`)
4. Deploy to `live` branch (NOT `gh-pages`) using `npx gh-pages -d out -b live`
5. Clean up build artifacts

**⚠️ DEPLOYMENT TARGET BRANCH: `live` (NOT `gh-pages`) ⚠️**

- GitHub Pages serves from the `live` branch
- The deployment uses `npx gh-pages -d out -b live -r [REPO_URL]`
- REPO_URL is dynamically retrieved via `git config --get remote.origin.url`

**VERIFICATION PROCESS:**
After deployment, verify:
1. Main site: https://iansebas.github.io/
2. PDF files: https://iansebas.github.io/pdfs/filename.pdf
3. Test PDF: https://iansebas.github.io/pdfs/test-claude.pdf (contains "i am claude")

**COMMON ISSUES & SOLUTIONS:**

If deployment fails with git pack corruption:
- The deployment may still succeed - check the `live` branch
- Verify PDFs are accessible on the live site
- Git errors don't necessarily mean deployment failure

If deployment fails with "branch already exists" error:
```bash
rm -rf node_modules/.cache/gh-pages
./deploy.sh
```

**DEPLOYMENT HISTORY & EVIDENCE:**
- Working method identified from commit 1916455 (deployment 23)
- Test verification completed Aug 25, 2025
- PDFs successfully deployed: wanderings.pdf, test-claude.pdf
- Branch target: `live` (confirmed via git ls-remote origin)

## Folder Structure

```
/
├── public/              # Static assets
│   ├── images/          # Images for the portfolio
│   ├── pdfs/            # PDF files (accessible via direct URL only)
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

## PDF Hosting

The `public/pdfs/` directory allows you to host PDF files that are accessible via direct URL but not navigable from the website:

- Drop PDF files into `public/pdfs/`
- Access them at: `https://iansebas.github.io/pdfs/filename.pdf`
- Files are not linked from the website navigation

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