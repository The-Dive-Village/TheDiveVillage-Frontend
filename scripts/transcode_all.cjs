const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;

const targetDir = path.resolve(__dirname, '../Frontend/public/videos/customize');
const tempDir = path.resolve(__dirname, '../scratch_temp');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const activities = [
  {
    id: 'canyoneering',
    name: 'Canyoneering',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791460085/TDV-Media/Services/Other/Canoneering.mp4',
    maxSeconds: 6,
  },
  {
    id: 'safari',
    name: 'Safari',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791691465/TDV-Media/AirportToAirport/gallery1.mp4',
    maxSeconds: 6,
  },
  {
    id: 'trekking',
    name: 'Trekking',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791685324/TDV-Media/AddOns/Trekking.mp4',
    maxSeconds: 6,
  },
  {
    id: 'surfing',
    name: 'Surfing',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791458534/TDV-Media/Services/3_Day_Surf_Academy_Course.mp4',
    maxSeconds: 6,
  },
  {
    id: 'sightseeing',
    name: 'Local Sightseeing',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791685371/TDV-Media/AddOns/sightseeing.mp4',
    maxSeconds: 6,
  },
  {
    id: 'camping_camper',
    name: 'Camping / Camper',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791686777/TDV-Media/AddOns/Campers.mp4',
    maxSeconds: 8,
  },
  {
    id: 'snorkeling',
    name: 'Snorkeling',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791458096/TDV-Media/Extras%20for%20Gallery/Free_Diving.mp4',
    maxSeconds: 6,
  },
  {
    id: 'liveaboard',
    name: 'Liveaboard',
    url: 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791458021/TDV-Media/Extras%20for%20Gallery/Beach_View.mp4',
    maxSeconds: 6,
  },
];

async function run() {
  console.log('Starting fast download + local transcode for Customize Dive Experience preview videos...');
  const results = [];

  for (const act of activities) {
    const tempFile = path.join(tempDir, `${act.id}_src.mp4`);
    const outFile = path.join(targetDir, `${act.id}.mp4`);

    console.log(`\n[${act.name}] Fetching source...`);
    const res = await fetch(act.url);
    if (!res.ok) {
      console.error(`Failed to fetch ${act.url}: HTTP ${res.status}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(tempFile, buffer);
    console.log(`[${act.name}] Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB. Transcoding...`);

    try {
      const cmd = `"${ffmpeg}" -y -i "${tempFile}" -t ${act.maxSeconds} -vf "scale='min(280,iw)':-2,setsar=1" -c:v libx264 -crf 28 -preset fast -pix_fmt yuv420p -an -movflags +faststart "${outFile}"`;
      execSync(cmd, { stdio: 'pipe' });

      const stats = fs.statSync(outFile);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`✓ Completed ${act.id}.mp4: ${sizeKB} KB (Saved ${((1 - stats.size / buffer.length) * 100).toFixed(1)}%)`);
      results.push({ id: act.id, name: act.name, sizeKB, path: outFile });
    } catch (err) {
      console.error(`❌ Transcode error on ${act.id}:`, err.message);
    } finally {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
  }

  // Cleanup temp dir
  try {
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
  } catch (e) {}

  console.log('\n=======================================');
  console.log('TRANSCODING SUMMARY:');
  console.log('=======================================');
  let totalKB = 0;
  results.forEach(r => {
    totalKB += parseFloat(r.sizeKB);
    console.log(`• ${r.name.padEnd(20)}: ${r.sizeKB} KB`);
  });
  console.log(`TOTAL PAYLOAD FOR ALL ${results.length} VIDEOS: ${(totalKB / 1024).toFixed(2)} MB`);
}

run();
