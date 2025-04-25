#!/bin/bash
set -e

# Deployment counter file
COUNTER_FILE=".deploy_count"

# Initialize counter if not present
if [ ! -f "$COUNTER_FILE" ]; then
  echo 1 > "$COUNTER_FILE"
fi

# Read and increment counter
COUNT=$(cat "$COUNTER_FILE")
NEXT_COUNT=$((COUNT + 1))
echo $NEXT_COUNT > "$COUNTER_FILE"

# Add all changes and commit to master
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "master" ]; then
  echo "You must be on the master branch to deploy. Current branch: $BRANCH"
  exit 1
fi

git add .
git commit -m "deployment $COUNT"
git push origin master

# Build and export
npm run build
npm run export

# Deploy to live branch using gh-pages
npx gh-pages -d out -b live

echo "Deployment $COUNT complete." 