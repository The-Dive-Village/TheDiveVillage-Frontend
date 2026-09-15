import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const assetsDir = path.resolve(__dirname, '../Frontend/src/assets')

const criticalMp4Files = [
  'Hero_fast.mp4',
  'Book_fast.mp4',
  'Turtle_fast.mp4',
  'nightdive_fast.mp4',
  'New folder/Itinerary.mp4',
  'New folder/Travel.mp4',
  'preloader.mp4'
]

console.log('🔍 [LFS Verification] Checking critical MP4 binary files before Vite build...')

let hasErrors = false

for (const relPath of criticalMp4Files) {
  const fullPath = path.join(assetsDir, relPath)
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ [LFS ERROR] Required video asset missing: ${relPath} (Full path: ${fullPath})`)
    hasErrors = true
    continue
  }

  const stats = fs.statSync(fullPath)
  if (stats.size <= 500) {
    console.error(`❌ [LFS ERROR] Video asset size too small (${stats.size} bytes): ${relPath}`)
    hasErrors = true
  }

  const fd = fs.openSync(fullPath, 'r')
  const buffer = Buffer.alloc(512)
  const bytesRead = fs.readSync(fd, buffer, 0, 512, 0)
  fs.closeSync(fd)

  const headerAscii = buffer.toString('utf8', 0, bytesRead)
  if (headerAscii.includes('version https://git-lfs.github.com/spec/v1')) {
    console.error(`❌ [LFS ERROR] Video asset is a Git LFS pointer text file! (${stats.size} bytes): ${relPath}`)
    hasErrors = true
    continue
  }

  const isFtyp = buffer.includes(Buffer.from('ftyp'))
  if (!isFtyp) {
    console.error(`❌ [LFS ERROR] Video asset does not contain a valid MP4 header ('ftyp'): ${relPath}`)
    hasErrors = true
    continue
  }

  console.log(`✅ [LFS OK] ${relPath} - Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB - Valid MP4 binary`)
}

if (hasErrors) {
  console.error('❌ [LFS BUILD FAILURE] One or more critical MP4 video assets are missing or unhydrated Git LFS pointers.')
  console.error('❌ Failing build to prevent publishing a broken bundle.')
  process.exit(1)
}

console.log('🚀 [LFS SUCCESS] All critical MP4 video assets verified as valid binary files!')
