import path from 'path'
import { test, expect } from '@playwright/test'

const BASE = '/mogumogu-paimon'
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'test-good.json')

test.describe('聖遺物カード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.locator('input[type="file"]').setInputFiles(FIXTURE_PATH)
    await page.waitForSelector('.controls-bar', { state: 'visible' })
  })

  test('カードが表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    await expect(card).toBeVisible()
  })

  test('スコアセクションが表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    await expect(card.locator('.score-section')).toBeVisible()
    await expect(card.locator('.main-score')).toBeVisible()
  })

  test('スコアランクバッジ（S/A/B/C）が表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    const badge = card.locator('.score-rank-badge')
    await expect(badge).toBeVisible()
    const text = await badge.textContent()
    expect(['S', 'A', 'B', 'C']).toContain(text?.trim())
  })

  test('サブステ行が1行以上表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    const substats = card.locator('.substat-row')
    expect(await substats.count()).toBeGreaterThan(0)
  })

  test('サブステ行には名前と値が表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    const firstSubstat = card.locator('.substat-row').first()
    await expect(firstSubstat.locator('.substat-name')).toBeVisible()
    await expect(firstSubstat.locator('.substat-value')).toBeVisible()
  })

  test('スコアバーが表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    await expect(card.locator('.score-bar-wrap')).toBeVisible()
    await expect(card.locator('.score-bar')).toBeVisible()
  })

  test('聖遺物画像エリアをクリックするとコンテキストメニューが表示される', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    const imgWrap = card.locator('.artifact-img-clickable')

    // クリック可能な場合のみテスト
    const count = await imgWrap.count()
    if (count === 0) {
      // クリック不可コンポーネントはスキップ
      return
    }

    await imgWrap.click()
    await expect(page.locator('.context-menu')).toBeVisible()
  })

  test('コンテキストメニューは画面外クリックで閉じる', async ({ page }) => {
    const card = page.locator('.artifact-card').first()
    const imgWrap = card.locator('.artifact-img-clickable')

    const count = await imgWrap.count()
    if (count === 0) return

    await imgWrap.click()
    await expect(page.locator('.context-menu')).toBeVisible()

    // 画面外（メインコンテナ）をクリックして閉じる
    await page.locator('.main-container').click({ position: { x: 5, y: 5 } })
    await expect(page.locator('.context-menu')).not.toBeVisible()
  })

  test('再構築成功率バッジが表示されている場合は数値が含まれる', async ({ page }) => {
    const reconBadge = page.locator('.recon-rate-badge').first()
    const count = await reconBadge.count()
    if (count === 0) return // 再構築成功率なしの場合はスキップ

    await expect(reconBadge).toBeVisible()
    const text = await reconBadge.textContent()
    expect(text).toMatch(/\d+%/)
  })
})
