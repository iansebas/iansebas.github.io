#!/bin/bash
set -e

echo "
##############################################################################
#                                                                            #
#                     STARTING DEPLOYMENT PROCESS                            #
#                                                                            #
##############################################################################
"

# Deployment counter file
COUNTER_FILE=".deploy_count"

# Initialize counter if not present
if [ ! -f "$COUNTER_FILE" ]; then
  echo 1 > "$COUNTER_FILE"
  echo "##### Created new deployment counter file #####"
fi

# Read and increment counter
COUNT=$(cat "$COUNTER_FILE")
NEXT_COUNT=$((COUNT + 1))
echo $NEXT_COUNT > "$COUNTER_FILE"
echo "
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                DEPLOYMENT NUMBER: $COUNT
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
"

# Check branch
echo "
##############################################################################
#                         CHECKING BRANCH                                    #
##############################################################################
"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "master" ]; then
  echo "
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!                                                           !!
  !!  ERROR: You must be on the master branch to deploy.       !!
  !!  Current branch: $BRANCH                                  !!
  !!                                                           !!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  "
  exit 1
fi
echo "✅ Branch check passed. Currently on master branch."

# Git operations
echo "
##############################################################################
#                         GIT OPERATIONS                                     #
##############################################################################
"
echo ">>> Adding all changes to git..."
git add .
echo "✅ Changes added."

echo ">>> Committing changes..."
git commit -m "deployment $COUNT"
echo "✅ Changes committed."

echo ">>> Pushing to master branch..."
git push origin master
echo "✅ Changes pushed to master branch."

# Build
echo "
##############################################################################
#                         BUILDING PROJECT                                   #
##############################################################################
"
echo ">>> Running build process (includes export)..."
npm run build
echo "✅ Build completed successfully."

# Deploy
echo "
##############################################################################
#                         DEPLOYING TO GH-PAGES BRANCH                       #
##############################################################################
"
echo ">>> Deploying to gh-pages branch using manual method..."

# Create a temp directory for the build
mkdir -p temp_deploy
echo ">>> Created temp deployment directory"

# Copy the build output to the temp directory
cp -r out/* temp_deploy/
cp out/.nojekyll temp_deploy/
echo ">>> Copied build output to temp directory"

# Switch to the gh-pages branch, creating it if it doesn't exist
git checkout -B gh-pages
echo ">>> Switched to gh-pages branch"

# Remove existing files (except .git and temp_deploy)
find . -maxdepth 1 ! -name 'temp_deploy' ! -name '.git' ! -name '.gitignore' ! -name '.' ! -name '..' -exec rm -rf {} \;
echo ">>> Cleared existing files"

# Move built files to the root
cp -r temp_deploy/* .
cp temp_deploy/.nojekyll .
echo ">>> Moved build files to root"

# Remove the temp directory
rm -rf temp_deploy
echo ">>> Cleaned up temp directory"

# Add all files to git
git add .
echo ">>> Added files to git"

# Commit the changes
git commit -m "Deploy website to GitHub Pages - deployment $COUNT"
echo ">>> Committed changes"

# Push to the gh-pages branch
git push -f origin gh-pages
echo ">>> Pushed to gh-pages branch"

# Return to the main branch
git checkout master
echo "✅ Deployment to gh-pages branch completed."

# Cleanup
echo "
##############################################################################
#                         CLEANING UP                                        #
##############################################################################
"
echo ">>> Removing build artifacts..."
rm -rf out
echo "✅ Cleanup completed."

echo "
##############################################################################
#                                                                            #
#                     DEPLOYMENT COMPLETE                                    #
#                                                                            #
#                     Deployment $COUNT successfully completed                #
#                                                                            #
#                     Live site should be updated shortly                    #
#                                                                            #
##############################################################################
" 