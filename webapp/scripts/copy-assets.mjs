/**
 * 画像コピースクリプト
 *
 * libs/gen/ から必要な画像ファイルを webapp/public/ へコピーする。
 *
 * 聖遺物画像:
 *   libs/gen/artifacts/[SetKey]/index.ts を解析してスロット→ファイル名マッピングを取得し、
 *   webapp/public/artifacts/[SetKey]/[slotKey].png としてコピー（リネーム）。
 *
 * キャラアイコン:
 *   libs/gen/chars/[CharKey]/UI_AvatarIcon_[CharKey].png を
 *   webapp/public/chars/[CharKey].png としてコピー。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEBAPP_DIR = path.resolve(__dirname, '..')
const LIBS_DIR = path.resolve(WEBAPP_DIR, '../libs/gen')
const PUBLIC_ARTIFACTS = path.join(WEBAPP_DIR, 'public', 'artifacts')
const PUBLIC_CHARS = path.join(WEBAPP_DIR, 'public', 'chars')

// スロットキーの正規表現パターン（import flower from './...' 形式）
const IMPORT_RE = /^import\s+(flower|plume|sands|goblet|circlet)\s+from\s+'\.\/([^']+)'/gm

/**
 * 聖遺物画像のコピー
 * index.ts を解析してスロット名→ファイル名マッピングを取得し、
 * [slotKey].png にリネームしてコピーする
 */
function copyArtifactImages() {
  const artifactsDir = path.join(LIBS_DIR, 'artifacts')
  const sets = fs.readdirSync(artifactsDir).filter(
    (name) => fs.statSync(path.join(artifactsDir, name)).isDirectory()
  )

  let copiedCount = 0
  for (const setKey of sets) {
    const setDir = path.join(artifactsDir, setKey)
    const indexPath = path.join(setDir, 'index.ts')

    if (!fs.existsSync(indexPath)) continue

    const source = fs.readFileSync(indexPath, 'utf-8')
    const destDir = path.join(PUBLIC_ARTIFACTS, setKey)
    fs.mkdirSync(destDir, { recursive: true })

    let match
    IMPORT_RE.lastIndex = 0
    while ((match = IMPORT_RE.exec(source)) !== null) {
      const slotKey = match[1]   // flower / plume / sands / goblet / circlet
      const srcFile = match[2]   // UI_RelicIcon_XXXXX_N.png
      const srcPath = path.join(setDir, srcFile)
      const destPath = path.join(destDir, `${slotKey}.png`)

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath)
        copiedCount++
      } else {
        console.warn(`[warn] 見つからない: ${srcPath}`)
      }
    }
  }
  console.log(`聖遺物画像: ${copiedCount} ファイルをコピーしました`)
}

/**
 * キャラアイコンのコピー
 * UI_AvatarIcon_[CharKey].png を探して [CharKey].png としてコピーする
 */
function copyCharIcons() {
  const charsDir = path.join(LIBS_DIR, 'chars')
  const chars = fs.readdirSync(charsDir).filter(
    (name) => fs.statSync(path.join(charsDir, name)).isDirectory()
  )

  fs.mkdirSync(PUBLIC_CHARS, { recursive: true })

  let copiedCount = 0
  for (const charKey of chars) {
    const charDir = path.join(charsDir, charKey)
    // UI_AvatarIcon_[CharKey].png を探す（Side 版は除外）
    const iconFile = fs.readdirSync(charDir).find(
      (f) => f.startsWith('UI_AvatarIcon_') && !f.includes('Side') && f.endsWith('.png')
    )
    if (!iconFile) {
      console.warn(`[warn] アイコンが見つからない: ${charKey}`)
      continue
    }

    const srcPath = path.join(charDir, iconFile)
    const destPath = path.join(PUBLIC_CHARS, `${charKey}.png`)
    fs.copyFileSync(srcPath, destPath)
    copiedCount++
  }
  console.log(`キャラアイコン: ${copiedCount} ファイルをコピーしました`)
}

console.log('画像コピー開始...')
copyArtifactImages()
copyCharIcons()
console.log('完了')
