const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'public', 'kep', 'manifest.json');
let data = fs.readFileSync(p, 'utf8');
// replace backslashes with forward slashes
data = data.replace(/\\\\/g, '/');
// also replace any remaining single backslashes
data = data.replace(/\\/g, '/');
fs.writeFileSync(p, data, 'utf8');
console.log('Fixed manifest slashes');
