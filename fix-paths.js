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

// Ensure /pdfs/wanderings.pdf redirects to external URL via 404 handler
// Strategy: do NOT publish the file locally so the request 404s, then
// inject a small script into out/404.html that performs a client-side redirect.

const pdfRedirectPath = './out/pdfs/wanderings.pdf';

// If a previous build created the file, remove it so the request 404s
try {
  if (fs.existsSync(pdfRedirectPath)) {
    fs.unlinkSync(pdfRedirectPath);
    console.log(`Removed local PDF to enable redirect: ${pdfRedirectPath}`);
  }
} catch (err) {
  console.warn(`Warning removing ${pdfRedirectPath}: ${err.message}`);
}

// Inject redirect logic into the generated 404.html
const notFoundPath = './out/404.html';
try {
  if (fs.existsSync(notFoundPath)) {
    let notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');

    const marker = '<!-- REDIRECT_INJECTED -->';
    if (!notFoundHtml.includes(marker)) {
      const redirectSnippet = `\n    ${marker}\n    <script>(function(){\n      try {\n        var p = (location.pathname || '').replace(/\\/+$/, '');\n        if (p === '/pdfs/wanderings.pdf') {\n          location.replace('https://www.unrulyabstractions.com/pdfs/wanderings.pdf');\n        }\n      } catch(e) {}\n    })();<\/script>\n`;

      // Prefer to insert early in <head> to run ASAP
      if (notFoundHtml.includes('<head>')) {
        notFoundHtml = notFoundHtml.replace('<head>', '<head>' + redirectSnippet);
      } else if (notFoundHtml.includes('</head>')) {
        notFoundHtml = notFoundHtml.replace('</head>', redirectSnippet + '</head>');
      } else {
        // Fallback: prepend to file
        notFoundHtml = redirectSnippet + notFoundHtml;
      }

      fs.writeFileSync(notFoundPath, notFoundHtml);
      console.log('Injected redirect into 404.html');
    } else {
      console.log('Redirect already injected into 404.html');
    }
  } else {
    console.warn('404.html not found in out directory; cannot inject redirect');
  }
} catch (err) {
  console.error('Failed to inject 404 redirect:', err.message);
}

console.log('Finished fixing paths and redirect setup for GitHub Pages');
