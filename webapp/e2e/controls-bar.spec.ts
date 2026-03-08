import path from 'path'
import { test, expect } from '@playwright/test'

const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'test-good.json')

test.describe('コントロールバー レイアウトテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // ファイルアップロードでコントロールバーを表示する
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(FIXTURE_PATH)

    // コントロールバーが表示されるまで待機
    await page.waitForSelector('.controls-bar', { state: 'visible' })
  })

  test('コントロールバーが画面外にはみ出していないこと', async ({ page }) => {
    const overflow = await page.evaluate(() => {
      const bar = document.querySelector('.controls-bar')
      if (!bar) return { scrollWidth: 0, clientWidth: 0, overflows: true }
      return {
        scrollWidth: bar.scrollWidth,
        clientWidth: bar.clientWidth,
        overflows: bar.scrollWidth > bar.clientWidth,
      }
    })

    expect(
      overflow.overflows,
      `コントロールバーがはみ出しています: scrollWidth(${overflow.scrollWidth}) > clientWidth(${overflow.clientWidth})`,
    ).toBe(false)
  })

  test('コントロールバーが表示され、スコア・フィルター・表示設定の各セクションが存在すること', async ({ page }) => {
    const controlsBar = page.locator('.controls-bar')
    await expect(controlsBar).toBeVisible()
    // スコアタイプセレクトが存在する
    await expect(controlsBar.locator('.ctrl-select').first()).toBeVisible()
    // 部位フィルタセレクトが存在する
    await expect(controlsBar.locator('.ctrl-select').nth(1)).toBeVisible()
    // 詳細フィルタボタンが存在する
    await expect(controlsBar.locator('.ctrl-advanced-btn')).toBeVisible()
  })
})
