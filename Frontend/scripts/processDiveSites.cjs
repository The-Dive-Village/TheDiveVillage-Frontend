const fs = require('fs');
const path = require('path');

// Country slug to clean display name mapping
const slugToCountryMap = {
  'indonesia': 'Indonesia',
  'malta': 'Malta',
  'egypt': 'Egypt',
  'cyprus': 'Cyprus',
  'caribbean-netherlands': 'Caribbean Netherlands',
  'india': 'India',
  'united-states-of-america-usa': 'United States of America (USA)',
  'mexico': 'Mexico',
  'malaysia': 'Malaysia',
  'colombia': 'Colombia',
  'united-arab-emirates': 'United Arab Emirates',
  'spain': 'Spain',
  'thailand': 'Thailand',
  'philippines': 'Philippines',
  'australia': 'Australia',
  'maldives': 'Maldives',
  'greece': 'Greece',
  'italy': 'Italy',
  'fiji': 'Fiji',
  'costa-rica': 'Costa Rica',
  'france': 'France',
  'bahamas': 'Bahamas',
  'belize': 'Belize',
  'turkey': 'Turkey',
  'croatia': 'Croatia',
  'portugal': 'Portugal',
  'jordan': 'Jordan',
  'south-africa': 'South Africa',
  'mauritius': 'Republic of Mauritius',
  'republic-of-mauritius': 'Republic of Mauritius',
  'japan': 'Japan',
  'canada': 'Canada',
  'united-kingdom': 'United Kingdom',
  'curacao': 'Curaçao',
  'dominican-republic': 'Dominican Republic',
  'honduras': 'Honduras',
  'cayman-islands': 'Cayman Islands',
  'bonaire': 'Caribbean Netherlands',
  'seychelles': 'Seychelles',
  'tanzania': 'Tanzania',
  'mozambique': 'Mozambique',
  'panama': 'Panama',
  'new-zealand': 'New Zealand',
  'iceland': 'Iceland',
  'norway': 'Norway',
  'germany': 'Germany',
  'switzerland': 'Switzerland',
  'austria': 'Austria',
  'saudi-arabia': 'Saudi Arabia',
  'oman': 'Oman',
  'vietnam': 'Vietnam',
  'french-polynesia': 'French Polynesia',
  'cook-islands': 'Cook Islands',
  'vanuatu': 'Vanuatu',
  'solomon-islands': 'Solomon Islands',
  'saint-lucia': 'Saint Lucia',
  'grenada': 'Grenada',
  'antigua-and-barbuda': 'Antigua and Barbuda',
  'barbados': 'Barbados',
  'bermuda': 'Bermuda',
  'british-virgin-islands': 'British Virgin Islands',
  'turks-and-caicos-islands': 'Turks and Caicos Islands',
  'sint-maarten': 'Sint Maarten',
  'sint-eustatius': 'Sint Eustatius',
  'saint-kitts-nevis': 'Saint Kitts & Nevis',
  'saint-vincent-the-grenadines': 'Saint Vincent & the Grenadines',
  'martinique': 'Martinique',
  'guadeloupe': 'The Guadeloupe Islands',
  'the-guadeloupe-islands': 'The Guadeloupe Islands',
  'reunion': 'Réunion',
  'madagascar': 'Madagascar',
  'cape-verde': 'Cape Verde',
  'singapore': 'Singapore',
  'hong-kong': 'Hong Kong',
  'taiwan': 'Taiwan',
  'south-korea': 'South Korea',
  'china': 'China',
  'albania': 'Albania',
  'montenegro': 'Montenegro',
  'romania': 'Romania',
  'bulgaria': 'Bulgaria',
  'slovenia': 'Slovenia',
  'slovakia': 'Slovakia',
  'czech-republic': 'Czech Republic',
  'poland': 'Poland',
  'hungary': 'Hungary',
  'finland': 'Finland',
  'sweden': 'Sweden',
  'denmark': 'Denmark',
  'ireland': 'Ireland',
  'belgium': 'Belgium',
  'netherlands': 'Netherlands',
  'israel': 'Israel',
  'kuwait': 'Kuwait',
  'bahrain': 'Bahrain',
  'qatar': 'Qatar',
  'lebanon': 'Lebanon',
  'tunisia': 'Tunisia',
  'senegal': 'Senegal',
  'malawi': 'Malawi',
  'kenya': 'Kenya',
  'aruba': 'Aruba',
  'jamaica': 'Jamaica',
  'nicaragua': 'Nicaragua',
  'guatemala': 'Guatemala',
  'ecuador': 'Ecuador',
  'peru': 'Peru',
  'chile': 'Chile',
  'argentina': 'Argentina',
  'brazil': 'Brazil',
  'venezuela': 'Venezuela',
  'tonga': 'Tonga',
  'samoa': 'Samoa',
  'timor-leste': 'Timor Leste (East Timor)',
  'timor-leste-east-timor': 'Timor Leste (East Timor)',
  'macau': 'Macau',
  'russia': 'Russia',
  'estonia': 'Estonia',
  'cambodia': 'Cambodia',
  'sri-lanka': 'Sri Lanka',
  'united-states-virgin-islands': 'U.S. Virgin Islands',
  'puerto-rico': 'Puerto Rico',
  'guam': 'Guam',
  'palau': 'Palau',
  'papua-new-guinea': 'Papua New Guinea',
  'federated-states-of-micronesia': 'Federated States of Micronesia',
  'trinidad-and-tobago': 'Trinidad and Tobago',
  'el-salvador': 'El Salvador',
  'dominica': 'Dominica',
  'brunei': 'Brunei',
  'northern-mariana-islands': 'Northern Mariana Islands',
  'sudan': 'Sudan',
  'libya': 'Libya',
  'iran': 'Iran',
  'keeling-islands': 'Cocos (Keeling) Islands',
  'latvia': 'Latvia',
  'western-sahara': 'Western Sahara',
  'british-indian-ocean-territory': 'British Indian Ocean Territory',
  'gibraltar': 'Gibraltar',
  'niue': 'Niue',
  'benin': 'Benin',
  'azerbaijan': 'Azerbaijan',
  'serbia': 'Serbia',
  'monaco': 'Monaco',
  'ukraine': 'Ukraine'
};

const csvPath = path.resolve(__dirname, '../../../TheDiveVillage-Backend/server/padi_dive_sites.csv');
console.log('Reading CSV from:', csvPath);
const content = fs.readFileSync(csvPath, 'utf8');

// Full multi-line CSV parser with quote handling
function parseFullCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  return rows;
}

const allRows = parseFullCsv(content);
const header = allRows[0];
console.log('Header:', header);

const idIndex = header.indexOf('id');
const titleIndex = header.indexOf('title');
const countryIndex = header.indexOf('country');
const latIndex = header.indexOf('latitude');
const lonIndex = header.indexOf('longitude');
const travelUrlIndex = header.indexOf('travel_url');
const maxDepthIndex = header.indexOf('maximum_depth');
const typesIndex = header.indexOf('types');

let totalRows = allRows.length - 1;
const uniqueIds = new Set();
const duplicateIds = [];
const invalidCoords = [];
const missingTitles = [];
const missingUrls = [];
const countryCounts = {};
const unmappedCountrySlugs = new Set();

const locationsByCountry = {};
const allLocations = [];

for (let i = 1; i < allRows.length; i++) {
  const row = allRows[i];
  if (row.length < 5) continue;

  const id = row[idIndex];
  const title = row[titleIndex];
  const countrySlug = row[countryIndex] ? row[countryIndex].toLowerCase().trim() : '';
  const latStr = row[latIndex];
  const lonStr = row[lonIndex];
  const travelUrl = row[travelUrlIndex] || '';

  if (!id) {
    console.log('Missing ID at row', i);
    continue;
  }

  if (uniqueIds.has(id)) {
    duplicateIds.push(id);
  }
  uniqueIds.add(id);

  if (!title) {
    missingTitles.push(id);
  }

  if (!travelUrl) {
    missingUrls.push(id);
  }

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    invalidCoords.push({ id, title, latStr, lonStr, rowNum: i });
    continue;
  }

  // Derive clean Country display name
  let countryName = slugToCountryMap[countrySlug];
  if (!countryName && travelUrl) {
    const match = travelUrl.match(/\/dive-site\/([^\/]+)\//);
    if (match) {
      const slugFromUrl = match[1].toLowerCase().trim();
      countryName = slugToCountryMap[slugFromUrl];
      if (!countryName) unmappedCountrySlugs.add(slugFromUrl);
    }
  }

  if (!countryName) {
    unmappedCountrySlugs.add(countrySlug);
    countryName = countrySlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;

  const siteObj = {
    id: String(id),
    name: title,
    title: title,
    country: countryName,
    countrySlug: countrySlug,
    latitude: lat,
    longitude: lon,
    travel_url: travelUrl,
    maximum_depth: maxDepthIndex !== -1 ? row[maxDepthIndex] : '',
    types: typesIndex !== -1 ? row[typesIndex] : ''
  };

  if (!locationsByCountry[countryName]) {
    locationsByCountry[countryName] = [];
  }
  locationsByCountry[countryName].push(siteObj);
  allLocations.push(siteObj);
}

const sortedCountries = Object.keys(locationsByCountry).sort();

const outputData = {
  totalLocations: allLocations.length,
  totalCountries: sortedCountries.length,
  countries: sortedCountries,
  locationsByCountry: locationsByCountry
};

const outputPath = path.resolve(__dirname, '../src/data/padiDiveSites.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

console.log('\n--- DATA VALIDATION & REPORT ---');
console.log('1. Total CSV rows:', totalRows);
console.log('2. Unique Dive Site IDs:', uniqueIds.size);
console.log('3. Duplicate IDs:', duplicateIds.length);
console.log('4. Invalid Coordinates Excluded:', invalidCoords.length);
console.log('5. Missing Titles:', missingTitles.length);
console.log('6. Missing Travel URLs:', missingUrls.length);
console.log('7. Unmapped Country Slugs:', Array.from(unmappedCountrySlugs));
console.log('8. Total Valid Sites Output:', allLocations.length);
console.log('9. Total Countries Represented:', sortedCountries.length);
console.log('Output written to:', outputPath);
