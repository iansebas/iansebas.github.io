# ⚠️ CRITICAL: PDF Deployment Documentation ⚠️

**VERIFIED WORKING DEPLOYMENT PROCESS**
*Last verified: Aug 25, 2025*

## Quick Reference

**Deploy PDFs to live site:**
```bash
./deploy.sh
```

**Verify deployment worked:**
```bash
curl -s https://iansebas.github.io/pdfs/[filename].pdf | shasum
```

## Critical Technical Details

### Deployment Target
- **Target branch**: `live` (NOT `gh-pages`)
- **Deployment command**: `npx gh-pages -d out -b live -r "$REPO_URL"`
- **GitHub Pages serves from**: `live` branch
- **REPO_URL**: Dynamically retrieved via `git config --get remote.origin.url`

### PDF Accessibility
- PDFs in `public/pdfs/` are accessible at: `https://iansebas.github.io/pdfs/filename.pdf`
- No navigation links from website - direct URL access only
- Files deploy with correct hashes and immediate availability

### Verification Evidence
- **Test PDF**: https://iansebas.github.io/pdfs/test-claude.pdf (contains "i am claude")
- **Main PDF**: https://iansebas.github.io/pdfs/wanderings.pdf
- **Expected hash (wanderings.pdf)**: `f71733435bf896386b92e2a829052df3fb5ad0e3`
- **Test PDF hash**: `bd5d849989f40cf277f21e9e462c7f84cced601a` (592 bytes)

### Common Issues & Solutions

**Git pack corruption errors:**
- These are misleading - deployment often succeeds despite errors
- Always verify PDFs on live site regardless of terminal output
- Check remote branch: `git ls-remote origin live`

**If PDFs don't update:**
1. Clear cache: `rm -rf node_modules/.cache/gh-pages`
2. Redeploy: `./deploy.sh`
3. Verify live site accessibility
4. Wait 5-10 minutes for CDN cache invalidation

### Historical Context
- Working method identified from commit 1916455 (deployment 23)
- Original script used `live` branch target, not `gh-pages`
- Deployment verified working Aug 25, 2025 at 03:00:39

### For AI Agents / Future Reference
- ALWAYS use `./deploy.sh` for deployments
- NEVER assume git errors mean deployment failure
- ALWAYS verify PDF accessibility on live site post-deployment
- Remote branches: `origin/live` (active), `origin/gh-pages` (legacy)
- The `npx gh-pages` package successfully deploys to `live` branch
- GitHub Pages configuration serves content from `live` branch

---
**This file is located at:** `public/pdfs/DEPLOYMENT_DOCUMENTATION.md`
**Last updated:** Aug 25, 2025
**Verified by:** Claude AI Agent
**Evidence:** Test PDF deployment successful, hashes verified