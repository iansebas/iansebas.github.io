const fs = require('fs');
const path = require('path');

// Function to recursively find HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (path.extname(file) === '.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all HTML files in the out directory
const htmlFiles = findHtmlFiles('./out');

console.log(`Found ${htmlFiles.length} HTML files to process`);

// Fix the paths in each HTML file
htmlFiles.forEach(filePath => {
  let htmlContent = fs.readFileSync(filePath, 'utf8');
  
  // Get the relative path depth to the root based on file location
  const pathToRoot = path.relative(path.dirname(filePath), './out').replace(/\\/g, '/');
  const pathPrefix = pathToRoot === '' ? '.' : pathToRoot;
  
  // Replace all instances of /_next/ with the correct relative path to _next/
  htmlContent = htmlContent.replace(/\/_next\//g, `${pathPrefix}/_next/`);
  
  // Fix root href="/" links to point to index.html or relative path to root
  htmlContent = htmlContent.replace(/href="\s*\/\s*"/g, `href="${pathPrefix === '.' ? './' : pathPrefix + '/'}"`)
  
  // Fix other root path references for links and images
  htmlContent = htmlContent.replace(/href="\/([^"/][^"]*?)"/g, `href="${pathPrefix}/$1"`);
  htmlContent = htmlContent.replace(/src="\/([^"/][^"]*?)"/g, `src="${pathPrefix}/$1"`);
  
  fs.writeFileSync(filePath, htmlContent);
  console.log(`Fixed paths in ${filePath}`);
});

// Ensure /pdfs/*.pdf redirects to external URL via 404 handler
// Strategy: do NOT publish any PDFs under /pdfs so the request 404s, then
// inject a small script into out/404.html that performs a client-side redirect
// to https://www.unrulyabstractions.com + original path.

const pdfsDirPath = './out/pdfs';

// Remove the out/pdfs directory entirely so that any /pdfs/*.pdf request 404s
try {
  if (fs.existsSync(pdfsDirPath)) {
    fs.rmSync(pdfsDirPath, { recursive: true, force: true });
    console.log(`Removed directory to enforce redirects: ${pdfsDirPath}`);
  }
} catch (err) {
  console.warn(`Warning removing ${pdfsDirPath}: ${err.message}`);
}

// Inject smart redirect logic into the generated 404.html
const notFoundPath = './out/404.html';
try {
  if (fs.existsSync(notFoundPath)) {
    let notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');

    const marker = '<!-- SMART_REDIRECT_INJECTED -->';
    if (!notFoundHtml.includes(marker)) {
      const smartRedirectSnippet = `\n    ${marker}\n    <script>\n(function() {\n  try {\n    var p = (location.pathname || '').replace(/\\/+$/, '');\n    \n    // Match any PDF under /pdfs (preserve query/hash)\n    if (/^\\/pdfs\\/[^?#]+\\.pdf$/i.test(p)) {\n      var target = 'https://www.unrulyabstractions.com' + p + (location.search || '') + (location.hash || '');\n      location.replace(target);\n      return;\n    }\n    \n    // Smart URL matching for unmatched routes\n    var resumeKeywords = ['resume', 'cv', 'curriculum', 'vitae', 'bio', 'biography', 'profile', 'about', 'experience', 'work', 'career', 'job', 'employment', 'professional', 'skills', 'education', 'qualifications', 'achievements', 'background'];\n    var wanderingsKeywords = ['wandering', 'wander', 'travel', 'journey', 'adventure', 'explore', 'trip', 'writing', 'stories', 'blog', 'thoughts', 'musings', 'reflections', 'personal', 'diary', 'essays', 'articles', 'posts', 'content'];\n    \n    function levenshteinDistance(str1, str2) {\n      var matrix = [];\n      if (str1.length === 0) return str2.length;\n      if (str2.length === 0) return str1.length;\n      for (var i = 0; i <= str2.length; i++) matrix[i] = [i];\n      for (var j = 0; j <= str1.length; j++) matrix[0][j] = j;\n      for (var i = 1; i <= str2.length; i++) {\n        for (var j = 1; j <= str1.length; j++) {\n          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {\n            matrix[i][j] = matrix[i - 1][j - 1];\n          } else {\n            matrix[i][j] = Math.min(\n              matrix[i - 1][j - 1] + 1,\n              matrix[i][j - 1] + 1,\n              matrix[i - 1][j] + 1\n            );\n          }\n        }\n      }\n      return matrix[str2.length][str1.length];\n    }\n    \n    function similarity(str1, str2) {\n      var longer = str1.length > str2.length ? str1 : str2;\n      var shorter = str1.length > str2.length ? str2 : str1;\n      var editDistance = levenshteinDistance(longer, shorter);\n      if (longer.length === 0) return 1.0;\n      return (longer.length - editDistance) / longer.length;\n    }\n    \n    function findBestMatch(input, keywords) {\n      var bestMatch = { keyword: '', score: 0 };\n      for (var i = 0; i < keywords.length; i++) {\n        var score = similarity(input.toLowerCase(), keywords[i].toLowerCase());\n        if (score > bestMatch.score) {\n          bestMatch = { keyword: keywords[i], score: score };\n        }\n      }\n      return bestMatch;\n    }\n    \n    // Skip redirect for valid routes\n    var validRoutes = ['/', '/about', '/contact', '/resume', '/work', '/resume_ian_rios.pdf', '/images', '/videos', '/_next', '/favicon.ico'];\n    var isValidRoute = validRoutes.some(function(route) {\n      return p === route || p.startsWith(route + '/') || p.startsWith('/_next/') || p.startsWith('/images/') || p.startsWith('/videos/');\n    });\n    \n    // Special handling for resume paths - always allow /resume and /resume/*\n    if (p.startsWith('/resume')) {\n      return;\n    }\n    \n    if (isValidRoute) return;\n    \n    // Calculate scores for both categories\n    var pathParts = p.toLowerCase().replace(/^\\//, '').split('/');\n    var fullPath = pathParts.join(' ');\n    var resumeScore = 0;\n    var wanderingsScore = 0;\n    \n    // Check each part of the path against keywords\n    for (var i = 0; i < pathParts.length; i++) {\n      if (pathParts[i]) {\n        var resumeMatch = findBestMatch(pathParts[i], resumeKeywords);\n        var wanderingsMatch = findBestMatch(pathParts[i], wanderingsKeywords);\n        resumeScore += resumeMatch.score;\n        wanderingsScore += wanderingsMatch.score;\n      }\n    }\n    \n    // Also check the full path as a single string\n    var fullResumeMatch = findBestMatch(fullPath, resumeKeywords);\n    var fullWanderingsMatch = findBestMatch(fullPath, wanderingsKeywords);\n    resumeScore += fullResumeMatch.score;\n    wanderingsScore += fullWanderingsMatch.score;\n    \n    // Redirect to the PDF with higher score, default to resume if tied\n    var targetPdf = wanderingsScore > resumeScore \n      ? 'https://www.unrulyabstractions.com/pdfs/wanderings.pdf'\n      : './resume_ian_rios.pdf';\n      \n    location.replace(targetPdf);\n    \n  } catch(e) {\n    // Fallback to resume on error\n    location.replace('./resume_ian_rios.pdf');\n  }\n})();\n<\/script>\n`;

      // Prefer to insert early in <head> to run ASAP
      if (notFoundHtml.includes('<head>')) {
        notFoundHtml = notFoundHtml.replace('<head>', '<head>' + smartRedirectSnippet);
      } else if (notFoundHtml.includes('</head>')) {
        notFoundHtml = notFoundHtml.replace('</head>', smartRedirectSnippet + '</head>');
      } else {
        // Fallback: prepend to file
        notFoundHtml = smartRedirectSnippet + notFoundHtml;
      }

      fs.writeFileSync(notFoundPath, notFoundHtml);
      console.log('Injected smart redirect into 404.html');
    } else {
      console.log('Smart redirect already injected into 404.html');
    }
  } else {
    console.warn('404.html not found in out directory; cannot inject redirect');
  }
} catch (err) {
  console.error('Failed to inject 404 redirect:', err.message);
}

console.log('Finished fixing paths and redirect setup for GitHub Pages');
