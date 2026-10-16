const cloudinary = require('c:/Users/TECQNIO/Documents/GitHub/TheDiveVillage/TheDiveVillage-Backend/server/node_modules/cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'qvbunv8y',
  api_key: '494533968621116',
  api_secret: 'eZa4bBcDJbsQ3RpEkfJgdWww-vM'
});

const videos = [
  { id: 'canyoneering', file: 'canyoneering.mp4' },
  { id: 'safari', file: 'safari.mp4' },
  { id: 'trekking', file: 'trekking.mp4' },
  { id: 'surfing', file: 'surfing.mp4' },
  { id: 'sightseeing', file: 'sightseeing.mp4' },
  { id: 'camping_camper', file: 'camping_camper.mp4' },
  { id: 'snorkeling', file: 'snorkeling.mp4' },
  { id: 'liveaboard', file: 'liveaboard.mp4' }
];

const publicDir = path.resolve(__dirname, '../Frontend/public/videos/customize');

async function uploadAll() {
  const mapping = {};
  for (const v of videos) {
    const fullPath = path.join(publicDir, v.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`File missing: ${fullPath}`);
      continue;
    }
    try {
      console.log(`Uploading ${v.id}...`);
      const res = await cloudinary.uploader.upload(fullPath, {
        resource_type: 'video',
        public_id: `TDV-Media/AddOnsLow/${v.id}_preview`,
        overwrite: true
      });
      console.log(`✓ ${v.id} -> ${res.secure_url}`);
      mapping[v.id] = res.secure_url;
    } catch (err) {
      console.error(`Failed ${v.id}:`, err.message);
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, '../Frontend/src/data/customizeLowVideos.json'),
    JSON.stringify(mapping, null, 2)
  );
  console.log('Saved mapping to Frontend/src/data/customizeLowVideos.json');
}

uploadAll();
