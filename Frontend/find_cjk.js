import fs from 'node:fs';

const csv = fs.readFileSync('public/data/dive-sites.csv', 'utf8');

// Match Chinese / CJK characters: \u4e00-\u9fff, \u3400-\u4dbf, \uf900-\ufaff
const cjkRegex = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

const lines = csv.split('\n');
console.log('Total lines in CSV:', lines.length);

const cjkLines = [];
lines.forEach((line, index) => {
  if (cjkRegex.test(line)) {
    cjkLines.push({ index: index + 1, line: line.trim() });
  }
});

console.log(`Found ${cjkLines.length} lines with Chinese/Taiwanese/CJK characters.`);
console.log('First 20 examples:');
cjkLines.slice(0, 20).forEach(c => console.log(`Line ${c.index}: ${c.line}`));
