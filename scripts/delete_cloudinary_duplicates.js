import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const envPath = path.resolve(__dirname, '../../TheDiveVillage-Backend/server/.env');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.trim().split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
  });
}

const cloudinary = require(path.resolve(__dirname, '../../TheDiveVillage-Backend/server/node_modules/cloudinary')).v2;

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Target assets to delete:
// 1. TDV-Audio/ambient_underwater.mp3 (video resource_type)
// 2. TDV-Media/Background/baracuda_compressed.mp4 (video resource_type)
// 3. TDV-Media/Extras for Gallery/Whitetip_Reef_Shark.mp4 (video resource_type)
// 4. TDV-Media/Products/TDV - 3D Product Files/Wet_Suit_-_Shortie_Male.glb (raw resource_type)
// 5. TDV-Media/Extras for Gallery/Scuba_Diving.webp (image resource_type)
// 6. TDV-Media/Extras for Gallery/Scuba_Diver.mp4 (video resource_type)
// 7. TDV-Media/Products/banner.webp (image resource_type)

const itemsToDelete = [
  { public_id: 'TDV-Audio/ambient_underwater', resource_type: 'video' },
  { public_id: 'TDV-Media/Background/baracuda_compressed', resource_type: 'video' },
  { public_id: 'TDV-Media/Extras for Gallery/Whitetip_Reef_Shark', resource_type: 'video' },
  { public_id: 'TDV-Media/Products/TDV - 3D Product Files/Wet_Suit_-_Shortie_Male.glb', resource_type: 'raw' },
  { public_id: 'TDV-Media/Extras for Gallery/Scuba_Diving', resource_type: 'image' },
  { public_id: 'TDV-Media/Extras for Gallery/Scuba_Diver', resource_type: 'video' },
  { public_id: 'TDV-Media/Products/banner', resource_type: 'image' },
];

async function run() {
  console.log(`Starting deletion of ${itemsToDelete.length} duplicate/redundant assets from Cloudinary...\n`);

  for (const item of itemsToDelete) {
    try {
      const res = await cloudinary.uploader.destroy(item.public_id, {
        resource_type: item.resource_type,
        invalidate: true
      });
      console.log(`• [${item.resource_type}] ${item.public_id} -> Result: ${res.result}`);
    } catch (err) {
      console.error(`❌ Failed to delete ${item.public_id}:`, err.message);
    }
  }

  console.log('\nFinished deletion process.');
}

run();
