// Mirrors dist/ into a target folder so the target ends up identical to dist/.
//   node scripts/copy-dist.js <target-folder>
// Wipes the target first (removing stale files), then copies dist/* in.
// Two things are left untouched in the target:
//   - .svn / .git metadata — wiping it would break the working copy.
//   - apiEndpoint.js — the runtime API config is set per-server, so the
//     target's existing copy must survive (not be overwritten or deleted).

const fs = require('fs');
const path = require('path');

const dest = process.argv[2];
if (!dest) {
  console.error('usage: node scripts/copy-dist.js <target-folder>');
  process.exit(1);
}

const repoRoot = path.join(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');

if (!fs.existsSync(distDir)) {
  console.error(`copy-dist: ${distDir} not found — run the build first (pnpm bundle)`);
  process.exit(1);
}

const destDir = path.resolve(dest);
fs.mkdirSync(destDir, { recursive: true });

// Entries left untouched: VCS metadata, plus the per-server API config which
// must not be overwritten or deleted.
const KEEP = new Set(['.svn', '.git', 'apiEndpoint.js']);

// Wipe existing contents so the target mirrors dist/ exactly (except KEEP).
for (const entry of fs.readdirSync(destDir)) {
  if (KEEP.has(entry)) continue;
  fs.rmSync(path.join(destDir, entry), { recursive: true, force: true });
}

// Copy each entry inside dist/ into destDir, so the target gets index.html,
// _expo/, etc. directly — not a nested dist/ folder. KEEP entries are skipped
// so the target's own copy survives.
for (const entry of fs.readdirSync(distDir)) {
  if (KEEP.has(entry)) continue;
  fs.cpSync(path.join(distDir, entry), path.join(destDir, entry), { recursive: true });
}

console.log(`copy-dist: mirrored dist/* → ${destDir}`);
