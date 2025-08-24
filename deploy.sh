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
echo ">>> Deploying to gh-pages branch using gh-pages..."

# Use SSH URL instead of HTTPS (or reuse the origin remote which should have authentication set up)
REPO_URL=$(git config --get remote.origin.url)
echo ">>> Using repository URL: $REPO_URL"

# Check if URL is HTTPS and provide a warning
if [[ $REPO_URL == https://* ]]; then
  echo "
  ⚠️  WARNING: Using HTTPS URL which may require token-based authentication ⚠️
  If deployment fails, consider switching to SSH:
    - Run: git remote set-url origin git@github.com:iansebas/iansebas.github.io.git
  Or use a GitHub Personal Access Token (classic) with repo scope
  "
fi

# Debug info
echo ">>> Git authentication method in use:"
if [[ -f ~/.git-credentials ]]; then
  echo "  - Git credentials helper is configured"
fi
if [[ -f ~/.ssh/id_rsa || -f ~/.ssh/id_ed25519 ]]; then
  echo "  - SSH keys are present"
fi

echo ">>> Attempting deployment with gh-pages..."
npx gh-pages -d out -b gh-pages -r "$REPO_URL"
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