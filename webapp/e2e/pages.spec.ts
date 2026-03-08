import path from 'path'
import { test, expect } from '@playwright/test'

const SCREENSHOT_DIR = path.join(__dirname, '..', '..', 'docs', 'screenshot')

// ─── about-score ───────────────────────────────────────────────────────────

test.describe('スコア説明ページ（about-score）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-score')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページコンテナが表示される', async ({ page }) => {
    await expect(page.locator('.page-container')).toBeVisible()
  })

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.locator('.page-title')).toBeVisible()
  })

  test('コンテンツセクションが複数存在する', async ({ page }) => {
    const sections = page.locator('.content-section')
    expect(await sections.count()).toBeGreaterThanOrEqual(3)
  })

  test('CVスコアのスコアティアリストが4段階表示される', async ({ page }) => {
    const tiers = page.locator('.score-tier')
    await expect(tiers.first()).toBeVisible()
    expect(await tiers.count()).toBe(4)
  })

  test('スコア式リストが1件以上表示される', async ({ page }) => {
    const formulas = page.locator('.score-formulas-item')
    expect(await formulas.count()).toBeGreaterThan(0)
    // 各アイテムにラベルと式が含まれる
    const firstItem = formulas.first()
    await expect(firstItem.locator('.score-formulas-label')).toBeVisible()
    await expect(firstItem.locator('.score-formulas-formula')).toBeVisible()
  })

  test('メインステフィルター説明テーブルが表示される', async ({ page }) => {
    const table = page.locator('table.info-table')
    await expect(table).toBeVisible()
    await expect(table.locator('thead')).toBeVisible()
    await expect(table.locator('tbody')).toBeVisible()
    // 行が1件以上ある
    const rows = table.locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('スクリーンショットを撮影する', async ({ page }, testInfo) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `about-score_${testInfo.project.name}.png`),
      fullPage: true,
    })
  })
})

// ─── about-reconstruction ──────────────────────────────────────────────────

test.describe('再構築説明ページ（about-reconstruction）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-reconstruction')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページコンテナが表示される', async ({ page }) => {
    await expect(page.locator('.page-container')).toBeVisible()
  })

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.locator('.page-title')).toBeVisible()
  })

  test('コンテンツセクションが複数存在する', async ({ page }) => {
    const sections = page.locator('.content-section')
    expect(await sections.count()).toBeGreaterThanOrEqual(4)
  })

  test('再構築種別リストが3種表示される', async ({ page }) => {
    // whatIs → types セクションのリスト
    const lists = page.locator('.content-list')
    await expect(lists.first()).toBeVisible()
    // 最初のリストが3種（通常/上級/絶対）
    const firstList = lists.first()
    const items = firstList.locator('li')
    expect(await items.count()).toBe(3)
  })

  test('セクション区切り線が表示される', async ({ page }) => {
    const dividers = page.locator('.section-divider')
    expect(await dividers.count()).toBeGreaterThanOrEqual(3)
  })

  test('スクリーンショットを撮影する', async ({ page }, testInfo) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `about-reconstruction_${testInfo.project.name}.png`),
      fullPage: true,
    })
  })
})

// ─── how-to-use ────────────────────────────────────────────────────────────

test.describe('使い方ページ（how-to-use）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/how-to-use')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページコンテナが表示される', async ({ page }) => {
    await expect(page.locator('.page-container')).toBeVisible()
  })

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.locator('.page-title')).toBeVisible()
  })

  test('3つのステップセクションが存在する', async ({ page }) => {
    const sections = page.locator('.content-section')
    expect(await sections.count()).toBe(3)
  })

  test('スキャンツールの外部リンクが3件表示される', async ({ page }) => {
    const links = page.locator('.content-list .content-link')
    expect(await links.count()).toBe(3)
    // 各リンクが target="_blank" を持つ
    for (let i = 0; i < 3; i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank')
      await expect(links.nth(i)).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('スクリーンショットを撮影する', async ({ page }, testInfo) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `how-to-use_${testInfo.project.name}.png`),
      fullPage: true,
    })
  })
})

// ─── faq ───────────────────────────────────────────────────────────────────

test.describe('FAQ ページ（faq）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/faq')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページコンテナが表示される', async ({ page }) => {
    await expect(page.locator('.page-container')).toBeVisible()
  })

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.locator('.page-title')).toBeVisible()
  })

  test('2件の Q&A セクションが表示される', async ({ page }) => {
    const sections = page.locator('.content-section')
    expect(await sections.count()).toBe(2)
    // 各セクションに見出しがある
    const headings = page.locator('.subsection-title')
    expect(await headings.count()).toBe(2)
  })

  test('外部リンクが noopener noreferrer で開く', async ({ page }) => {
    const externalLinks = page.locator('.content-link[target="_blank"]')
    expect(await externalLinks.count()).toBeGreaterThan(0)
    const firstLink = externalLinks.first()
    await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('スクリーンショットを撮影する', async ({ page }, testInfo) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `faq_${testInfo.project.name}.png`),
      fullPage: true,
    })
  })
})

// ─── disclaimer ────────────────────────────────────────────────────────────

test.describe('免責事項ページ（disclaimer）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/disclaimer')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページコンテナが表示される', async ({ page }) => {
    await expect(page.locator('.page-container')).toBeVisible()
  })

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.locator('.page-title')).toBeVisible()
  })

  test('2つのセクションが表示される', async ({ page }) => {
    const sections = page.locator('.content-section')
    expect(await sections.count()).toBe(2)
  })

  test('各セクションにタイトルとテキストが含まれる', async ({ page }) => {
    const sections = page.locator('.content-section')
    for (let i = 0; i < 2; i++) {
      const section = sections.nth(i)
      await expect(section.locator('.section-title')).toBeVisible()
      await expect(section.locator('.content-text').first()).toBeVisible()
    }
  })

  test('スクリーンショットを撮影する', async ({ page }, testInfo) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `disclaimer_${testInfo.project.name}.png`),
      fullPage: true,
    })
  })
})
