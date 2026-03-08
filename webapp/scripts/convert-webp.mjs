/**
 * WebP変換スクリプト
 *
 * public/artifacts/ および public/chars/ 以下の PNG ファイルを
 * WebP 形式に変換して同じディレクトリに保存する。
 *
 * 使用方法:
 *   node scripts/convert-webp.mjs
 *
 * npm run build の prebuild フックとして自動実行される。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEBAPP_DIR = path.resolve(__dirname, '..')
const PUBLIC_ARTIFACTS = path.join(WEBAPP_DIR, 'public', 'artifacts')
const PUBLIC_CHARS = path.join(WEBAPP_DIR, 'public', 'chars')

/**
 * 指定ディレクトリ以下の PNG ファイルを再帰的に取得する
 * @param {string} dir
 * @returns {string[]}
 */
function findPngFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findPngFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      results.push(fullPath)
    }
  }
  return results
}

/**
 * PNG ファイルを WebP に変換する
 * @param {string} pngPath PNG ファイルのパス
 * @returns {Promise<void>}
 */
async function convertToWebp(pngPath) {
  const webpPath = pngPath.replace(/\.png$/, '.webp')
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
}

async function main() {
  const pngFiles = [
    ...findPngFiles(PUBLIC_ARTIFACTS),
    ...findPngFiles(PUBLIC_CHARS),
  ]

  if (pngFiles.length === 0) {
    console.log('変換対象の PNG ファイルが見つかりませんでした')
    return
  }

  console.log(`WebP変換開始: ${pngFiles.length} ファイル`)

  let convertedCount = 0
  let skippedCount = 0

  await Promise.all(
    pngFiles.map(async (pngPath) => {
      const webpPath = pngPath.replace(/\.png$/, '.webp')
      // すでに WebP が存在し PNG より新しい場合はスキップ
      if (fs.existsSync(webpPath)) {
        const pngMtime = fs.statSync(pngPath).mtimeMs
        const webpMtime = fs.statSync(webpPath).mtimeMs
        if (webpMtime >= pngMtime) {
          skippedCount++
          return
        }
      }
      await convertToWebp(pngPath)
      convertedCount++
    })
  )

  console.log(`WebP変換完了: ${convertedCount} 変換, ${skippedCount} スキップ`)
}

main().catch((err) => {
  console.error('WebP変換エラー:', err)
  process.exit(1)
})
