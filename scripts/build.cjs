const fs = require('fs');
const path = require('path');

function log(...args) { console.log('[build]', ...args); }

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'public');

const itemsToCopy = [
  'index.html',
  'manifest.json',
  'offline.html',
  'service-worker.js',
  'assets',
  'src'
];

function rmDir(dir) {
  if (fs.existsSync(dir)) {
    log('Removing', dir);
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyItem(srcRel) {
  const src = path.join(root, srcRel);
  const dest = path.join(out, srcRel);
  if (!fs.existsSync(src)) {
    log('Warning: source not found, skipping', srcRel);
    return;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    // copy recursively
    const entries = fs.readdirSync(src);
    for (const e of entries) {
      const childRel = path.join(srcRel, e);
      copyItem(childRel);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    log('Copied', srcRel);
  }
}

function main() {
  log('Starting build -> public/');
  rmDir(out);
  fs.mkdirSync(out, { recursive: true });
  for (const it of itemsToCopy) copyItem(it);
  log('Build complete. Files available in', out);
}

try {
  main();
} catch (err) {
  console.error('[build] Error:', err);
  process.exit(1);
}
