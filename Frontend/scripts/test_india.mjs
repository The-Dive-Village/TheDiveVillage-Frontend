import fs from 'fs'
import Papa from 'papaparse'

const csv = fs.readFileSync('public/data/dive-sites.csv', 'utf8')
const rows = Papa.parse(csv, { header: true }).data
const indiaSites = rows.filter(r => (r.Country || r.country) === 'India')
console.log('India sites count:', indiaSites.length)
let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
indiaSites.forEach(s => {
  const lat = parseFloat(s.Latitude || s.latitude)
  const lng = parseFloat(s.Longitude || s.longitude)
  if (lng < minLng) minLng = lng
  if (lng > maxLng) maxLng = lng
  if (lat < minLat) minLat = lat
  if (lat > maxLat) maxLat = lat
  console.log(s.Site_Name || s.siteName, lng, lat)
})
console.log('India bounds:', [[minLng, minLat], [maxLng, maxLat]])
console.log('dLng:', maxLng - minLng, 'dLat:', maxLat - minLat)
