import fs from 'node:fs';

const csv = fs.readFileSync('public/data/dive-sites.csv', 'utf8');
const lines = csv.split('\n');

const nonAsciiLines = [];

lines.forEach((line, index) => {
  if (index === 0) return; // header
  // Check for non-ascii characters (outside 0-127)
  if (/[^\x00-\x7F]/.test(line)) {
    const parts = line.split(',');
    const id = parts[0];
    const country = parts[1];
    const name = parts[2];
    nonAsciiLines.push({ lineNum: index + 1, id, country, name, raw: line });
  }
});

console.log(`Total lines with non-ASCII characters: ${nonAsciiLines.length}`);
console.log('Sample of non-ASCII sites:');
nonAsciiLines.slice(0, 30).forEach(s => console.log(`${s.id} | ${s.country} | ${s.name}`));
