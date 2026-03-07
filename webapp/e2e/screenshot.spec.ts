import path from 'path'
import { test } from '@playwright/test'

const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'test-good.json')
const SCREENSHOT_DIR = path.join(__dirname, '../../docs/screenshot')

/** アップロード前の初期状態 */
test('01_initial-page', async ({ page }) => {
  await page.goto('/')
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '01_initial-page.png'),
    fullPage: true,
  })
})

test.describe('アップロード後', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(FIXTURE_PATH)
    await page.waitForSelector('.controls-bar', { state: 'visible' })
  })

  /** アップロード直後の全体ビュー */
  test('02_after-upload', async ({ page }) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02_after-upload.png'),
      fullPage: true,
    })
  })

  /** コントロールバーの拡大 */
  test('03_controls-bar', async ({ page }) => {
    const controlsBar = page.locator('.controls-bar')
    await controlsBar.screenshot({
      path: path.join(SCREENSHOT_DIR, '03_controls-bar.png'),
    })
  })

  /** 最初のアーティファクトカード */
  test('04_card-sample', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    await card.screenshot({
      path: path.join(SCREENSHOT_DIR, '04_card-sample.png'),
    })
  })

  /** サブステフィルタドロップダウン開 */
  test('05_substat-dropdown', async ({ page }) => {
    // .controls-bar 内の2番目の .substat-dropdown-btn がサブステフィルタ
    await page.locator('.controls-bar .substat-dropdown-btn').nth(1).click()
    await page.waitForSelector('.substat-dropdown-panel', { state: 'visible' })
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05_substat-dropdown.png'),
      fullPage: true,
    })
  })

  /** セットフィルタドロップダウン開 */
  test('06_set-dropdown', async ({ page }) => {
    // .controls-bar 内の最初の .substat-dropdown-btn がセットフィルタ
    await page.locator('.controls-bar .substat-dropdown-btn').first().click()
    await page.waitForSelector('.set-dropdown-panel', { state: 'visible' })
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06_set-dropdown.png'),
      fullPage: true,
    })
  })
})
