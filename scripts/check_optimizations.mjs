import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'Frontend', 'src');

console.log('====================================================');
console.log('THE DIVE VILLAGE — PERMANENT OPTIMIZATION GUARDRAIL');
console.log('====================================================\n');

let failed = false;

function error(msg) {
  console.error(`❌ FAIL: ${msg}`);
  failed = true;
}

function pass(msg) {
  console.log(`✅ PASS: ${msg}`);
}

// 1. Check for .comm typos in all source files
function scanDirectory(dir, testFn) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        scanDirectory(fullPath, testFn);
      }
    } else if (/\.(jsx?|tsx?|html|css|json)$/i.test(entry.name)) {
      testFn(fullPath, fs.readFileSync(fullPath, 'utf8'));
    }
  }
}

console.log('--- 1. Scanning for .comm Typo Regressions ---');
let commCount = 0;
scanDirectory(srcDir, (file, content) => {
  if (content.includes('.comm')) {
    error(`Found .comm typo in: ${path.relative(rootDir, file)}`);
    commCount++;
  }
});
if (commCount === 0) {
  pass('Zero .comm typos found in Frontend/src');
}

// 2. Check canonical URLs in page files
console.log('\n--- 2. Checking Canonical URL Domain Purity (.co) ---');
let comPageCount = 0;
const pagesDir = path.join(srcDir, 'pages');
scanDirectory(pagesDir, (file, content) => {
  if (content.includes('canonicalUrl="https://thedivevillage.com') || content.includes('canonicalUrl={`https://thedivevillage.com')) {
    error(`Found hardcoded .com canonical in: ${path.relative(rootDir, file)}`);
    comPageCount++;
  }
});
if (comPageCount === 0) {
  pass('All page canonical tags correctly reference target domain https://thedivevillage.co');
}

// 3. Verify products.js uses Cloudinary and not uncompressed local wetsuit PNGs
console.log('\n--- 3. Checking Product Media Architecture ---');
const productsJsPath = path.join(srcDir, 'utils', 'products.js');
const productsContent = fs.readFileSync(productsJsPath, 'utf8');
if (productsContent.includes('Black Wetsuit with Dive Village Logos.png') && !productsContent.includes('https://res.cloudinary.com')) {
  error('Local uncompressed wetsuit PNG imported into products.js');
} else {
  pass('Full Wetsuit imagery delivered via Cloudinary CDN');
}

// 4. Verify vite.config.js manualChunks and workbox precache safety
console.log('\n--- 4. Checking Vite Build & PWA Precache Guardrails ---');
const viteConfigPath = path.join(rootDir, 'Frontend', 'vite.config.js');
const viteContent = fs.readFileSync(viteConfigPath, 'utf8');

if (!viteContent.includes('vendor-three') || !viteContent.includes('vendor-maplibre')) {
  error('Rollup manualChunks missing vendor-three or vendor-maplibre isolation');
} else {
  pass('Three.js and MapLibre isolated in Rollup manualChunks');
}

if (!viteContent.includes('vendor-three-*') || !viteContent.includes('vendor-maplibre-*')) {
  error('PWA Workbox globIgnores does not exclude heavy vendor chunks from precache');
} else {
  pass('Workbox correctly excludes heavy vendor chunks from initial PWA precache');
}

// 5. Verify AppRouter code splits Home
console.log('\n--- 5. Checking AppRouter Route Code-Splitting ---');
const appRouterPath = path.join(srcDir, 'router', 'AppRouter.jsx');
const routerContent = fs.readFileSync(appRouterPath, 'utf8');
if (routerContent.includes("import Home from '../pages/Home'")) {
  error('Home.jsx is eagerly imported instead of lazy-loaded with lazyWithRetry');
} else if (routerContent.includes("lazyWithRetry(() => import('../pages/Home'))")) {
  pass('Home.jsx is code-split with lazyWithRetry');
}

console.log('\n----------------------------------------------------');
if (failed) {
  console.error('❌ OPTIMIZATION GUARDRAIL FAILED: Regressions detected.');
  process.exit(1);
} else {
  console.log('🎉 ALL OPTIMIZATION GUARDRAILS PASSED: Architecture is pristine.');
  process.exit(0);
}
