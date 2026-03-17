import path from 'path'
import { test, expect } from '@playwright/test'

const BASE = '/mogumogu-paimon'
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'test-good.json')

test.describe('ホームページ — 初期状態（ファイルアップロード前）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('domcontentloaded')
  })

  test('ヒーローセクションが表示される', async ({ page }) => {
    await expect(page.locator('.hero-section')).toBeVisible()
  })

  test('ヒーロー装飾要素が表示される', async ({ page }) => {
    await expect(page.locator('.hero-border-top')).toBeAttached()
    await expect(page.locator('.hero-eyebrow')).toBeVisible()
    await expect(page.locator('.hero-eyebrow')).toHaveText('✦ Artifact Score ✦')
    await expect(page.locator('.hero-title')).toBeVisible()
    await expect(page.locator('.hero-title')).toHaveText('もぐもぐパイモン')
    await expect(page.locator('.hero-divider')).toBeVisible()
  })

  test('アップロードゾーンが表示される', async ({ page }) => {
    await expect(page.locator('.upload-zone')).toBeVisible()
    await expect(page.locator('input[type="file"]')).toBeAttached()
  })

  test('スコア式カードグリッドが表示される', async ({ page }) => {
    const grid = page.locator('.score-card-grid')
    await expect(grid).toBeVisible()
    // スコア式カードが複数存在する
    const cards = grid.locator('.score-formula-card')
    await expect(cards).toHaveCount(await cards.count())
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('スコア式カードをクリックするとアクティブ状態に切り替わる', async ({ page }) => {
    const firstCard = page.locator('.score-formula-card').first()
    await firstCard.click()
    await expect(firstCard).toHaveClass(/score-formula-card-active/)

    // 再クリックで非アクティブに戻る
    await firstCard.click()
    await expect(firstCard).not.toHaveClass(/score-formula-card-active/)
  })

  test('コントロールバーはアップロード前は非表示', async ({ page }) => {
    await expect(page.locator('.controls-bar')).not.toBeVisible()
  })
})

test.describe('ホームページ — ファイルアップロード後', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(FIXTURE_PATH)
    await page.waitForSelector('.controls-bar', { state: 'visible' })
  })

  test('コントロールバーが表示される', async ({ page }) => {
    await expect(page.locator('.controls-bar')).toBeVisible()
  })

  test('聖遺物カードが1枚以上表示される', async ({ page }) => {
    const cards = page.locator('.artifact-card')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('ヒーローセクションは非表示になる', async ({ page }) => {
    await expect(page.locator('.hero-section')).not.toBeVisible()
  })

  test('部位フィルタで flower を選択するとカードが絞り込まれる', async ({ page }) => {
    const allCount = await page.locator('.artifact-card').count()

    const slotSelect = page.locator('.controls-bar .ctrl-select').nth(1)
    await slotSelect.selectOption('flower')

    const filteredCount = await page.locator('.artifact-card').count()
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThanOrEqual(allCount)
  })

  test('部位フィルタをリセットするとチップが消える', async ({ page }) => {
    const slotSelect = page.locator('.controls-bar .ctrl-select').nth(1)
    await slotSelect.selectOption('flower')

    // フィルタチップが現れる
    await expect(page.locator('.ctrl-filter-chips')).toBeVisible()

    // 全件表示に戻す
    await slotSelect.selectOption('')
    await expect(page.locator('.ctrl-filter-chips')).not.toBeVisible()
  })

  test('フィルタチップの × ボタンで絞り込みが解除される', async ({ page }) => {
    const slotSelect = page.locator('.controls-bar .ctrl-select').nth(1)
    await slotSelect.selectOption('flower')

    // チップの × をクリック
    const chip = page.locator('.ctrl-filter-chip').first()
    await chip.click()

    await expect(page.locator('.ctrl-filter-chips')).not.toBeVisible()
  })

  test('スコアタイプを切り替えるとカードに反映される', async ({ page }) => {
    const scoreSelect = page.locator('.controls-bar .ctrl-select').first()
    // 攻撃型以外に切り替え
    await scoreSelect.selectOption('CV')
    // カードが表示され続ける
    await expect(page.locator('.artifact-card').first()).toBeVisible()
  })
})
