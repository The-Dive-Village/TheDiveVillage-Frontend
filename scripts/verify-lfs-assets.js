import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoOwner = 'The-Dive-Village'
const repoName = 'TheDiveVillage-Frontend'
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

function parseLfsPointer(content) {
  const lines = content.split(/\r?\n/)
  let oid = null
  let size = null

  for (const line of lines) {
    if (line.startsWith('oid sha256:')) {
      oid = line.replace('oid sha256:', '').trim()
    } else if (line.startsWith('size ')) {
      size = parseInt(line.replace('size ', '').trim(), 10)
    }
  }

  if (oid && size) {
    return { oid, size }
  }
  return null
}

function fetchLfsDownloadUrl(oid, size) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      operation: 'download',
      transfers: ['basic'],
      objects: [{ oid, size }]
    })

    const req = https.request(`https://github.com/${repoOwner}/${repoName}.git/info/lfs/objects/batch`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.git-lfs+json',
        'Content-Type': 'application/vnd.git-lfs+json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'Node-LFS-Verifier'
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const json = JSON.parse(data)
            const downloadUrl = json.objects?.[0]?.actions?.download?.href
            if (downloadUrl) {
              resolve(downloadUrl)
            } else {
              reject(new Error(`No download action returned for OID ${oid}`))
            }
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new Error(`LFS Batch API HTTP ${res.statusCode}: ${data}`))
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject)
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`))
      }

      const fileStream = fs.createWriteStream(destPath)
      res.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => reject(err))
      })
    }).on('error', reject)
  })
}

async function verifyAndHydrateAssets() {
  console.log('🔍 [LFS Verification] Checking critical MP4 binary files before Vite build...')
  let hasErrors = false

  for (const relPath of criticalMp4Files) {
    const fullPath = path.join(assetsDir, relPath)
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ [LFS ERROR] Required video asset missing: ${relPath} (Full path: ${fullPath})`)
      hasErrors = true
      continue
    }

    let stats = fs.statSync(fullPath)
    let isPointer = false

    if (stats.size <= 1024) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes('version https://git-lfs.github.com/spec/v1')) {
        isPointer = true
      }
    }

    if (isPointer) {
      console.log(`💧 [LFS Hydrating] ${relPath} is a Git LFS pointer text file. Fetching binary payload from GitHub...`)
      const content = fs.readFileSync(fullPath, 'utf8')
      const pointer = parseLfsPointer(content)

      if (pointer) {
        try {
          const downloadUrl = await fetchLfsDownloadUrl(pointer.oid, pointer.size)
          await downloadFile(downloadUrl, fullPath)
          stats = fs.statSync(fullPath)
          console.log(`✅ [LFS HYDRATED] ${relPath} downloaded (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`)
          isPointer = false
        } catch (err) {
          console.error(`❌ [LFS ERROR] Failed to hydrate ${relPath}: ${err.message}`)
          hasErrors = true
          continue
        }
      } else {
        console.error(`❌ [LFS ERROR] Could not parse pointer file format: ${relPath}`)
        hasErrors = true
        continue
      }
    }

    if (stats.size <= 500) {
      console.error(`❌ [LFS ERROR] Video asset size too small (${stats.size} bytes): ${relPath}`)
      hasErrors = true
      continue
    }

    const fd = fs.openSync(fullPath, 'r')
    const buffer = Buffer.alloc(512)
    const bytesRead = fs.readSync(fd, buffer, 0, 512, 0)
    fs.closeSync(fd)

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
}

verifyAndHydrateAssets().catch(err => {
  console.error('❌ [LFS Verification Fatal Error]', err)
  process.exit(1)
})
