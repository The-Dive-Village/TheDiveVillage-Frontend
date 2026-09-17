import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoOwner = 'The-Dive-Village'
const repoName = 'TheDiveVillage-Frontend'
const assetsDir = path.resolve(__dirname, '../Frontend/src/assets')

function getFilesRecursively(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath))
    } else {
      results.push(filePath)
    }
  })
  return results
}

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
        'User-Agent': 'Node-LFS-Hydrator'
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
          reject(new Error(`LFS Batch API returned HTTP ${res.statusCode}: ${data}`))
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
        return reject(new Error(`Failed to download binary: HTTP ${res.statusCode}`))
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

async function hydrateLfsAssets() {
  console.log('💧 [LFS Hydrator] Checking repository assets for unhydrated Git LFS pointers...')
  const files = getFilesRecursively(assetsDir)
  let pointersFound = 0
  let hydrated = 0

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase()
    if (!['.mp4', '.mov', '.webm', '.png', '.jpg', '.jpeg'].includes(ext)) continue

    const stats = fs.statSync(filePath)
    if (stats.size > 1024) continue

    const content = fs.readFileSync(filePath, 'utf8')
    if (!content.includes('version https://git-lfs.github.com/spec/v1')) continue

    const pointer = parseLfsPointer(content)
    if (!pointer) continue

    pointersFound++
    const relPath = path.relative(assetsDir, filePath)
    console.log(`⬇️ [LFS Hydrating] Fetching LFS binary for ${relPath} (${pointer.size} bytes)...`)

    try {
      const downloadUrl = await fetchLfsDownloadUrl(pointer.oid, pointer.size)
      await downloadFile(downloadUrl, filePath)
      const newStats = fs.statSync(filePath)
      console.log(`✅ [LFS Hydrated] ${relPath} successfully downloaded (${(newStats.size / (1024 * 1024)).toFixed(2)} MB)`)
      hydrated++
    } catch (err) {
      console.error(`❌ [LFS Hydrate Error] Failed to hydrate ${relPath}: ${err.message}`)
    }
  }

  if (pointersFound === 0) {
    console.log('✨ [LFS Hydrator] All assets are already fully hydrated binaries!')
  } else {
    console.log(`🎉 [LFS Hydrator] Hydrated ${hydrated} / ${pointersFound} Git LFS pointer files!`)
  }
}

hydrateLfsAssets().catch(err => {
  console.error('❌ [LFS Hydrator Error]', err)
  process.exit(1)
})
