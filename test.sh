#!/bin/bash
set -e

# ⚠️ LOCAL TESTING SCRIPT ⚠️
# 
# This script tests the production build locally
# It does NOT deploy to GitHub Pages
# 
# For actual deployment to live site, use: ./deploy.sh
# 
# VERIFIED DEPLOYMENT INFO (Aug 25, 2025):
# - Live site: https://iansebas.github.io/
# - PDFs accessible at: https://iansebas.github.io/pdfs/filename.pdf
# - GitHub Pages serves from 'live' branch (NOT gh-pages)
# - Test PDF: https://iansebas.github.io/pdfs/test-claude.pdf

# Build the production build
echo ">>> Building production version for local testing..."
npx next build

echo ">>> Starting local server at http://localhost:3000"
echo ">>> This is LOCAL TESTING ONLY - does not deploy to live site"
echo ">>> For deployment to live site, use: ./deploy.sh"

# Start the production server using serve
npx serve@latest out 