#!/bin/bash
set -e

# ⚠️ AUTOMATED DEPLOYMENT TEST SCRIPT ⚠️
# 
# PURPOSE: Verify deployment process works reliably
# WHAT IT DOES:
# 1. Deploys to live site 
# 2. Verifies main site is accessible
# 3. Reports success/failure with evidence
#
# USAGE: ./test-deployment.sh
# 
# FOR FUTURE CLAUDE: Use this script to verify deployment before claiming it works!
# This prevents overconfident claims without verification.

echo "
🚀 AUTOMATED DEPLOYMENT TEST STARTING
====================================="

# Generate unique test identifier
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TEST_ID="test_${TIMESTAMP}"

echo ">>> Test ID: ${TEST_ID}"

# Deploy
echo "
>>> DEPLOYING TO LIVE SITE...
"
./deploy.sh

# Wait for CDN propagation (GitHub Pages/Fastly CDN delay)
echo ">>> Waiting 30 seconds for GitHub Pages CDN propagation..."
sleep 30

# Test live site accessibility
echo "
>>> VERIFYING DEPLOYMENT ON LIVE SITE...
"
LIVE_URL="https://iansebas.github.io/"
echo ">>> Testing URL: ${LIVE_URL}"

# Check site accessibility with retries for CDN delays
MAX_RETRIES=3
RETRY_COUNT=0
HTTP_CODE="404"

while [ "${HTTP_CODE}" != "200" ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo ">>> Attempt ${RETRY_COUNT}/${MAX_RETRIES}: Testing ${LIVE_URL}"
    HTTP_CODE=$(curl -s -w "%{http_code}" "${LIVE_URL}" -o "/dev/null")
    
    if [ "${HTTP_CODE}" != "200" ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo ">>> Got HTTP ${HTTP_CODE}, waiting 10 seconds before retry..."
        sleep 10
    fi
done

if [ "${HTTP_CODE}" = "200" ]; then
    echo "
✅ DEPLOYMENT TEST PASSED!
========================
- Main site successfully deployed and accessible
- Live URL responds: ${LIVE_URL}
- HTTP Status: ${HTTP_CODE}
- Deployment process verified working
"
    TEST_RESULT="PASSED"
else
    echo "
❌ DEPLOYMENT TEST FAILED!
=========================
- Main site not accessible
- URL: ${LIVE_URL}
- HTTP Code: ${HTTP_CODE}
- This indicates deployment didn't work
"
    TEST_RESULT="FAILED"
fi

# Final result
echo "
🏁 DEPLOYMENT TEST COMPLETE
===========================
Result: ${TEST_RESULT}
Test ID: ${TEST_ID}
Timestamp: $(date)
"

if [ "${TEST_RESULT}" = "FAILED" ]; then
    echo "❌ Deployment verification failed - investigate before claiming deployment works!"
    exit 1
else
    echo "✅ Deployment verified working - safe to proceed with confidence!"
    exit 0
fi