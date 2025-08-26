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

// Create proper HTTP redirect using Jekyll front matter
const pdfDirPath = './out/pdfs';
const pdfRedirectPath = './out/pdfs/wanderings.pdf';

// Ensure the pdfs directory exists
if (!fs.existsSync(pdfDirPath)) {
  fs.mkdirSync(pdfDirPath, { recursive: true });
}

// Create Jekyll redirect page
const pdfRedirectContent = `---
redirect_to: https://www.unrulyabstractions.com/pdfs/wanderings.pdf
permalink: /pdfs/wanderings.pdf
---`;

fs.writeFileSync(pdfRedirectPath, pdfRedirectContent);
console.log('Created Jekyll redirect at ' + pdfRedirectPath);

// Also create _config.yml to enable Jekyll redirects
const configPath = './out/_config.yml';
const configContent = `plugins:
  - jekyll-redirect-from

defaults:
  - scope:
      path: ""
    values:
      layout: null`;

fs.writeFileSync(configPath, configContent);
console.log('Created Jekyll config at ' + configPath);

console.log('Finished fixing paths for GitHub Pages');