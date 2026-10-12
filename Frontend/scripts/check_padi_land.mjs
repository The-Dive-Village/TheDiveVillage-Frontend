import fs from 'fs';

const mallorcaShifted = [
  { id: '377', name: 'Punta Martin', lat: 39.46552, lng: 2.50098, padi_lat: 39.46588, padi_lng: 2.49870 },
  { id: '378', name: 'Punta Cautius', lat: 39.46340, lng: 2.50922, padi_lat: 39.46376, padi_lng: 2.50694 },
  { id: '381', name: 'Illetes', lat: 39.53442, lng: 2.59094, padi_lat: 39.53476, padi_lng: 2.58865 },
  { id: '383', name: 'Carlotta', lat: 39.45730, lng: 2.51952, padi_lat: 39.45766, padi_lng: 2.51724 },
  { id: '384', name: 'Portalls Vells', lat: 39.47427, lng: 2.52673, padi_lat: 39.47463, padi_lng: 2.52445 },
  { id: '9487', name: 'Palmanova Bay', lat: 39.51343, lng: 2.54412, padi_lat: 39.51377, padi_lng: 2.54183 },
  { id: '10242', name: 'Cala Montjo', lat: 39.52754, lng: 2.43302, padi_lat: 39.52789, padi_lng: 2.43072 },
  { id: '14617', name: 'Palma Cavern', lat: 39.54714, lng: 2.62253, padi_lat: 39.54747, padi_lng: 2.62023 },
  { id: '14639', name: 'Punta Cala Figuera', lat: 39.45650, lng: 2.52433, padi_lat: 39.45687, padi_lng: 2.52204 },
  { id: '14877', name: 'Punta Marc', lat: 39.46161, lng: 2.50660, padi_lat: 39.46197, padi_lng: 2.50432 },
];

async function checkPadi() {
  for (const s of mallorcaShifted) {
    const urlPadi = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${s.padi_lat}&lon=${s.padi_lng}`;
    const resPadi = await fetch(urlPadi, { headers: { 'User-Agent': 'TDV-Check/1.0' } });
    const jPadi = await resPadi.json();
    
    console.log(`\n--- ${s.name} ---`);
    console.log(`PADI (${s.padi_lat}, ${s.padi_lng}):`, jPadi.display_name || jPadi.error);
    await new Promise(r => setTimeout(r, 1000));
  }
}
checkPadi();
