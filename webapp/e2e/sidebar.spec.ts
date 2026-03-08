import { test, expect } from '@playwright/test'

const BASE = '/mogumogu-paimon'

test.describe('サイドバー — ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('domcontentloaded')
  })

  test('サイドバーが表示される', async ({ page }) => {
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('ナビゲーションリンクが1件以上存在する', async ({ page }) => {
    const links = page.locator('.sidebar-link')
    expect(await links.count()).toBeGreaterThan(0)
  })

  test('about-score ページへ遷移できる', async ({ page }) => {
    const link = page.locator('.sidebar-link[href*="about-score"]')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/about-score/)
  })

  test('about-reconstruction ページへ遷移できる', async ({ page }) => {
    const link = page.locator('.sidebar-link[href*="about-reconstruction"]')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/about-reconstruction/)
  })

  test('how-to-use ページへ遷移できる', async ({ page }) => {
    const link = page.locator('.sidebar-link[href*="how-to-use"]')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/how-to-use/)
  })

  test('faq ページへ遷移できる', async ({ page }) => {
    const link = page.locator('.sidebar-link[href*="faq"]')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/faq/)
  })

  test('disclaimer ページへ遷移できる', async ({ page }) => {
    const link = page.locator('.sidebar-link[href*="disclaimer"]')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/disclaimer/)
  })

  test('現在のページのリンクに active クラスが付与される', async ({ page }) => {
    // about-score へ遷移
    await page.locator('.sidebar-link[href*="about-score"]').click()
    await expect(page).toHaveURL(/about-score/)
    await expect(page.locator('.sidebar-link-active')).toBeVisible()
  })
})

test.describe('サイドバー — 言語切替', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('domcontentloaded')
    // Next.js dev overlay がボタンのクリックを妨害するため除去
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((el) => el.remove())
    })
  })

  test('言語切替ボタンが EN と JA の2つ表示される', async ({ page }) => {
    await expect(page.locator('button.lang-btn:has-text("JA")')).toBeVisible()
    await expect(page.locator('button.lang-btn:has-text("EN")')).toBeVisible()
  })

  test('JA ボタンをクリックすると日本語に切り替わる', async ({ page }) => {
    await page.locator('button.lang-btn:has-text("JA")').click()
    await expect(
      page.locator('button.lang-btn:has-text("JA")[aria-pressed="true"]'),
    ).toBeVisible()
  })

  test('EN ボタンをクリックすると英語に切り替わる', async ({ page }) => {
    // まず JA に切り替え
    await page.locator('button.lang-btn:has-text("JA")').click()
    // EN に戻す
    await page.locator('button.lang-btn:has-text("EN")').click()
    await expect(
      page.locator('button.lang-btn:has-text("EN")[aria-pressed="true"]'),
    ).toBeVisible()
  })

  test('言語設定が localStorage に保存され、リロード後も維持される', async ({ page }) => {
    await page.locator('button.lang-btn:has-text("JA")').click()
    await expect(
      page.locator('button.lang-btn:has-text("JA")[aria-pressed="true"]'),
    ).toBeVisible()

    // ページリロード
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // JA が維持されている
    await expect(
      page.locator('button.lang-btn:has-text("JA")[aria-pressed="true"]'),
    ).toBeVisible({ timeout: 5000 })
  })
})
