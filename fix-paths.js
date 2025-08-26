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

// Create proper HTTP redirect by fetching the actual PDF and saving it locally
const https = require('https');

const pdfDirPath = './out/pdfs';
const pdfRedirectPath = './out/pdfs/wanderings.pdf';

// Ensure the pdfs directory exists
if (!fs.existsSync(pdfDirPath)) {
  fs.mkdirSync(pdfDirPath, { recursive: true });
}

// Download the actual PDF file and save it locally
function downloadPDF() {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(pdfRedirectPath);
    const request = https.get('https://www.unrulyabstractions.com/pdfs/wanderings.pdf', (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded PDF to ' + pdfRedirectPath);
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Download the PDF synchronously
try {
  const child_process = require('child_process');
  child_process.execSync(`curl -s -o "${pdfRedirectPath}" "https://www.unrulyabstractions.com/pdfs/wanderings.pdf"`);
  console.log('Downloaded PDF to ' + pdfRedirectPath);
} catch (error) {
  console.error('Failed to download PDF:', error.message);
}

console.log('Finished fixing paths for GitHub Pages');