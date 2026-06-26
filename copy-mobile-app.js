const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'android') {
        copyDir(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const mobileSrc = path.join(__dirname, 'mobile-app', 'src');
const publicDest = path.join(__dirname, 'public', 'app');

if (fs.existsSync(mobileSrc)) {
  console.log('Copying mobile-app/src to public/app...');
  copyDir(mobileSrc, publicDest);
  console.log('Done!');
} else {
  console.warn('mobile-app/src folder not found.');
}
