#!/bin/bash
set -e

# Build the production build
npx next build

# Start the production server
npx next start 