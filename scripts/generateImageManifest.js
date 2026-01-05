const fs = require('fs');
const path = require('path');

const publicKep = path.join(__dirname, '..', 'public', 'kep');
const outFile = path.join(publicKep, 'manifest.json');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach((dirent) => {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      results.push(...walk(full));
    } else {
      // only include typical image/file types
      const ext = path.extname(dirent.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        // convert to web path starting with /kep/
        const webPath = '/kep/' + path.relative(publicKep, full).replace(/\\\\/g, '/');
        results.push(webPath);
      }
    }
  });
  return results;
}

try {
  const images = walk(publicKep);
  fs.writeFileSync(outFile, JSON.stringify(images, null, 2), 'utf8');
  console.log(`Wrote ${images.length} image paths to ${outFile}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
