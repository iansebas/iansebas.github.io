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
  
  // Replace all instances of /_next/ with ./next/
  htmlContent = htmlContent.replace(/\/_next\//g, './_next/');
  
  // Also fix image and link paths that start with / but aren't /_next/
  // Skip href="/" which should stay as root
  htmlContent = htmlContent.replace(/href="\/([^"/][^"]*?)"/g, 'href="./$1"');
  htmlContent = htmlContent.replace(/src="\/([^"/][^"]*?)"/g, 'src="./$1"');
  
  fs.writeFileSync(filePath, htmlContent);
  console.log(`Fixed paths in ${filePath}`);
});

console.log('Finished fixing paths for GitHub Pages');