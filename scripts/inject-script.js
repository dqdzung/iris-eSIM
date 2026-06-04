// Post-build hook: copies a script from scripts/ into dist/, then injects a
// <script src="..."> tag into dist/index.html right before </head>. Runs
// after `expo export -p web` (see the predeploy script in package.json).
// Idempotent — running twice is a no-op.

const fs = require('fs');
const path = require('path');

// Source file lives next to this script. The same filename is copied to
// dist/ and referenced via a root-absolute path so SPA routes (e.g.
// /detail/123) resolve correctly.
const SCRIPT_FILENAME = 'apiEndpoint.js';

const srcPath = path.join(__dirname, SCRIPT_FILENAME);
const repoRoot = path.join(__dirname, '..');
const destPath = path.join(repoRoot, 'dist', SCRIPT_FILENAME);
const htmlPath = path.join(repoRoot, 'dist', 'index.html');
const tag = `<script src="/${SCRIPT_FILENAME}"></script>`;

if (!fs.existsSync(srcPath)) {
  console.error(`inject-script: source ${srcPath} not found`);
  process.exit(1);
}

if (!fs.existsSync(htmlPath)) {
  console.error(`inject-script: ${htmlPath} not found — did the export step run?`);
  process.exit(1);
}

fs.copyFileSync(srcPath, destPath);
console.log(`inject-script: copied ${SCRIPT_FILENAME} → dist/`);

const html = fs.readFileSync(htmlPath, 'utf8');

if (html.includes(tag)) {
  console.log(`inject-script: tag already present, skipping inject`);
  process.exit(0);
}

if (!html.includes('</head>')) {
  console.error(`inject-script: no </head> in ${htmlPath} — bailing`);
  process.exit(1);
}

fs.writeFileSync(htmlPath, html.replace('</head>', `  ${tag}\n  </head>`));
console.log(`inject-script: injected <script src="/${SCRIPT_FILENAME}">`);
