#!/bin/bash
set -e

# ⚠️ AUTOMATED DEPLOYMENT TEST SCRIPT ⚠️
# 
# PURPOSE: Verify deployment process works reliably
# WHAT IT DOES:
# 1. Creates unique test PDF with timestamp
# 2. Deploys to live site 
# 3. Verifies PDF is accessible on live site
# 4. Cleans up test artifacts
# 5. Reports success/failure with evidence
#
# USAGE: ./test-deployment.sh
# 
# FOR FUTURE CLAUDE: Use this script to verify deployment before claiming it works!
# This prevents overconfident claims without verification.

echo "
🚀 AUTOMATED DEPLOYMENT TEST STARTING
=====================================
"

# Generate unique test identifier
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TEST_ID="test_${TIMESTAMP}"
TEST_PDF="test-deployment-${TEST_ID}.pdf"
TEST_CONTENT="Deployment test ${TEST_ID} - $(date)"

echo ">>> Test ID: ${TEST_ID}"
echo ">>> Test PDF: ${TEST_PDF}"

# Create test PDF with unique content
echo ">>> Creating test PDF with unique content..."
cat > "public/pdfs/${TEST_PDF}" << EOF
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 84 >>
stream
BT
/F1 12 Tf
72 720 Td
(${TEST_CONTENT}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000120 00000 n 
0000000260 00000 n 
0000000400 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
480
%%EOF
EOF

echo "✅ Test PDF created: public/pdfs/${TEST_PDF}"

# Get local hash for verification
LOCAL_HASH=$(shasum "public/pdfs/${TEST_PDF}" | cut -d' ' -f1)
echo ">>> Local PDF hash: ${LOCAL_HASH}"

# Deploy
echo "
>>> DEPLOYING TO LIVE SITE...
"
./deploy.sh

# Wait a moment for deployment propagation
echo ">>> Waiting 10 seconds for deployment propagation..."
sleep 10

# Test live site accessibility
echo "
>>> VERIFYING DEPLOYMENT ON LIVE SITE...
"
LIVE_URL="https://iansebas.github.io/pdfs/${TEST_PDF}"
echo ">>> Testing URL: ${LIVE_URL}"

# Download and verify
HTTP_CODE=$(curl -s -w "%{http_code}" "${LIVE_URL}" -o "/tmp/${TEST_PDF}")
if [ "${HTTP_CODE}" = "200" ]; then
    LIVE_HASH=$(shasum "/tmp/${TEST_PDF}" | cut -d' ' -f1)
    echo ">>> Live PDF hash: ${LIVE_HASH}"
    
    if [ "${LOCAL_HASH}" = "${LIVE_HASH}" ]; then
        echo "
✅ DEPLOYMENT TEST PASSED!
========================
- Test PDF successfully deployed
- Hashes match: ${LOCAL_HASH}
- Live URL accessible: ${LIVE_URL}
- Deployment process verified working
"
        TEST_RESULT="PASSED"
    else
        echo "
❌ DEPLOYMENT TEST FAILED!
=========================
- PDF deployed but hashes don't match
- Local hash: ${LOCAL_HASH}
- Live hash: ${LIVE_HASH}
- This indicates deployment corruption
"
        TEST_RESULT="FAILED"
    fi
else
    echo "
❌ DEPLOYMENT TEST FAILED!
=========================
- Test PDF not accessible on live site
- URL: ${LIVE_URL}
- HTTP Code: ${HTTP_CODE}
- This indicates deployment didn't work
"
    TEST_RESULT="FAILED"
fi

# Cleanup test artifacts
echo "
>>> CLEANING UP TEST ARTIFACTS...
"
rm -f "public/pdfs/${TEST_PDF}"
rm -f "/tmp/${TEST_PDF}"
echo "✅ Test artifacts cleaned up"

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