const fs = require('fs');
const Papa = require('papaparse');

const csvPath = 'public/data/dive-sites.csv';
const csvRaw = fs.readFileSync(csvPath, 'utf8');

const parsed = Papa.parse(csvRaw, { header: true, skipEmptyLines: true });
console.log(`Total parsed rows: ${parsed.data.length}`);

// 1. NIGHT DIVE
console.log('\n--- 1. NIGHT DIVE ---');
parsed.data.forEach((row, i) => {
  if ((row.Site_Name || '').toUpperCase().includes('NIGHT DIVE')) {
    console.log(`Row ${i}: ID=${row.ID}, Country=${row.Country}, Site_Name=${row.Site_Name}, Lat=${row.Latitude}, Lng=${row.Longitude}`);
  }
});

// 2. Coral Gardens
console.log('\n--- 2. Coral Gardens ---');
parsed.data.forEach((row, i) => {
  if ((row.Site_Name || '').toLowerCase().includes('coral garden')) {
    console.log(`Row ${i}: ID=${row.ID}, Country=${row.Country}, Site_Name=${row.Site_Name}, Lat=${row.Latitude}, Lng=${row.Longitude}`);
  }
});

// 3. Simmons Caves
console.log('\n--- 3. Simmons Caves ---');
parsed.data.forEach((row, i) => {
  if ((row.Site_Name || '').toLowerCase().includes('simmon')) {
    console.log(`Row ${i}: ID=${row.ID}, Country=${row.Country}, Site_Name=${row.Site_Name}, Lat=${row.Latitude}, Lng=${row.Longitude}`);
  }
});

// 4. Kuwait
console.log('\n--- 4. Kuwait ---');
parsed.data.forEach((row, i) => {
  if ((row.Country || '').toLowerCase() === 'kuwait') {
    console.log(`Row ${i}: ID=${row.ID}, Site_Name=${row.Site_Name}, Lat=${row.Latitude}, Lng=${row.Longitude}`);
  }
});

// 5. Mozambique
console.log('\n--- 5. Mozambique ---');
parsed.data.forEach((row, i) => {
  if ((row.Country || '').toLowerCase().includes('mozambique') || (row.Country || '').toLowerCase().includes('mosambique')) {
    console.log(`Row ${i}: ID=${row.ID}, Site_Name=${row.Site_Name}, Lat=${row.Latitude}, Lng=${row.Longitude}`);
  }
});

// 6. Gibberish & weird names
console.log('\n--- 6. Gibberish & Quotes ---');
parsed.data.forEach((row, i) => {
  const name = row.Site_Name || '';
  if (name.includes('FreeDiver') || name.includes('SubShark') || name.includes('"') || name.includes('\\') || /^[A-Z0-9.\s_-]{2,}\s+(Club|Center|Shop|Diver|Resort)$/i.test(name)) {
    console.log(`Row ${i}: ID=${row.ID}, Country=${row.Country}, Site_Name=${name}`);
  }
});

// 7. All UPPERCASE or all lowercase names
console.log('\n--- 7. Casing check (UPPERCASE or lowercase) ---');
let upperCount = 0;
let lowerCount = 0;
parsed.data.forEach((row, i) => {
  const name = row.Site_Name || '';
  const country = row.Country || '';
  // Check if all letters in name are uppercase (and has at least 3 letters)
  const letters = name.replace(/[^a-zA-Z]/g, '');
  if (letters.length >= 3) {
    if (letters === letters.toUpperCase() && letters.length > 3) {
      console.log(`ALL UPPERCASE: ID=${row.ID}, Country=${country}, Site_Name=${name}`);
      upperCount++;
    } else if (letters === letters.toLowerCase()) {
      console.log(`ALL LOWERCASE: ID=${row.ID}, Country=${country}, Site_Name=${name}`);
      lowerCount++;
    }
  }
  // Check country casing
  const cLetters = country.replace(/[^a-zA-Z]/g, '');
  if (cLetters.length >= 2 && cLetters === cLetters.toUpperCase()) {
    console.log(`ALL UPPERCASE COUNTRY: ID=${row.ID}, Country=${country}`);
  }
});
console.log(`Total UPPERCASE: ${upperCount}, LOWERCASE: ${lowerCount}`);
