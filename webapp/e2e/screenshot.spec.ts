import path from 'path'
import { test, type Page, type Locator } from '@playwright/test'

const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'test-good.json')
const OUT_DIR = path.join(__dirname, '..', '..', 'docs', 'screenshot')
const BASE = '/mogumogu-paimon'

/**
 * スクリーンショットを保存する。高さは最大1600pxにクリップ。
 */
async function shot(page: Page, filename: string, opts: { fullPage?: boolean } = {}) {
  const filepath = path.join(OUT_DIR, filename)
  if (opts.fullPage) {
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
    const h = Math.min(pageHeight, 1600)
    await page.screenshot({ path: filepath, clip: { x: 0, y: 0, width: 1600, height: h } })
  } else {
    await page.screenshot({ path: filepath, clip: { x: 0, y: 0, width: 1600, height: 1600 } })
  }
}

/**
 * 要素のスクリーンショットを保存する。
 */
async function shotLocator(locator: Locator, filename: string) {
  await locator.screenshot({ path: path.join(OUT_DIR, filename) })
}

/**
 * ファイルアップロードしてコントロールバーが表示されるまで待機。
 */
async function uploadAndWait(page: Page) {
  await page.locator('input[type="file"]').setInputFiles(FIXTURE_PATH)
  await page.waitForSelector('.controls-bar', { state: 'visible' })
}

/**
 * 日本語に切り替わるまで待機（addInitScript でlocalStorageをセット済みが前提）。
 */
async function waitForJapanese(page: Page) {
  await page.locator('button.lang-btn:has-text("JA")[aria-pressed="true"]').waitFor({ timeout: 5000 })
}

// ============================================================
// EN: 情報ページ（ファイルアップロード不要）
// ============================================================

test('01_en_initial-page', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await page.waitForLoadState('domcontentloaded')
  await shot(page, '01_en_initial-page.png', { fullPage: true })
})

test('07_en_about-score', async ({ page }) => {
  await page.goto(`${BASE}/about-score`)
  await page.waitForLoadState('domcontentloaded')
  await shot(page, '07_en_about-score.png', { fullPage: true })
})

test('08_en_about-reconstruction', async ({ page }) => {
  await page.goto(`${BASE}/about-reconstruction`)
  await page.waitForLoadState('domcontentloaded')
  await shot(page, '08_en_about-reconstruction.png', { fullPage: true })
})

test('09_en_how-to-use', async ({ page }) => {
  await page.goto(`${BASE}/how-to-use`)
  await page.waitForLoadState('domcontentloaded')
  await shot(page, '09_en_how-to-use.png', { fullPage: true })
})

test('10_en_faq', async ({ page }) => {
  await page.goto(`${BASE}/faq`)
  await page.waitForLoadState('domcontentloaded')
  await shot(page, '10_en_faq.png', { fullPage: true })
})

test('11_en_disclaimer', async ({ page }) => {
  await page.goto(`${BASE}/disclaimer`)
  await page.waitForLoadState('domcontentloaded')
  await shot(page, '11_en_disclaimer.png', { fullPage: true })
})

// ============================================================
// EN: ホームページ（ファイルアップロード後）
// ============================================================

test.describe('EN: アップロード後', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
    await uploadAndWait(page)
  })

  test('02_en_after-upload', async ({ page }) => {
    await shot(page, '02_en_after-upload.png')
  })

  test('03_en_controls-bar', async ({ page }) => {
    await shotLocator(page.locator('.controls-bar'), '03_en_controls-bar.png')
  })

  test('04_en_card-sample', async ({ page }) => {
    await shotLocator(page.locator('.artifact-card').first(), '04_en_card-sample.png')
  })

  test('05_en_substat-dropdown', async ({ page }) => {
    // 詳細フィルターパネルを開いてからサブステフィルタボタンをクリック
    await page.locator('.ctrl-advanced-btn').click()
    await page.waitForSelector('.ctrl-advanced-panel', { state: 'visible' })
    await page.locator('.ctrl-advanced-panel .substat-dropdown-btn').click()
    await page.waitForSelector('.substat-dropdown-panel', { state: 'visible' })
    await shot(page, '05_en_substat-dropdown.png')
  })

  test('06_en_set-dropdown', async ({ page }) => {
    // セットフィルタボタンはコントロールバー内の最初の substat-dropdown-btn
    await page.locator('.controls-bar .substat-dropdown-btn').first().click()
    await page.waitForSelector('.set-dropdown-panel', { state: 'visible' })
    await shot(page, '06_en_set-dropdown.png')
  })
})

// ============================================================
// JA: 日本語
// ============================================================

test.describe('JA: 日本語', () => {
  test.beforeEach(async ({ page }) => {
    // ページ読み込み前にlocalStorageへ日本語設定をセット
    await page.addInitScript(() => {
      localStorage.setItem('mogumogu-lang', 'ja')
    })
  })

  test('12_ja_initial-page', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await waitForJapanese(page)
    await shot(page, '12_ja_initial-page.png', { fullPage: true })
  })

  test('18_ja_about-score', async ({ page }) => {
    await page.goto(`${BASE}/about-score`)
    await waitForJapanese(page)
    await shot(page, '18_ja_about-score.png', { fullPage: true })
  })

  test('19_ja_about-reconstruction', async ({ page }) => {
    await page.goto(`${BASE}/about-reconstruction`)
    await waitForJapanese(page)
    await shot(page, '19_ja_about-reconstruction.png', { fullPage: true })
  })

  test('20_ja_how-to-use', async ({ page }) => {
    await page.goto(`${BASE}/how-to-use`)
    await waitForJapanese(page)
    await shot(page, '20_ja_how-to-use.png', { fullPage: true })
  })

  test('21_ja_faq', async ({ page }) => {
    await page.goto(`${BASE}/faq`)
    await waitForJapanese(page)
    await shot(page, '21_ja_faq.png', { fullPage: true })
  })

  test('22_ja_disclaimer', async ({ page }) => {
    await page.goto(`${BASE}/disclaimer`)
    await waitForJapanese(page)
    await shot(page, '22_ja_disclaimer.png', { fullPage: true })
  })

  test.describe('アップロード後', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/`)
      await waitForJapanese(page)
      await uploadAndWait(page)
    })

    test('13_ja_after-upload', async ({ page }) => {
      await shot(page, '13_ja_after-upload.png')
    })

    test('14_ja_controls-bar', async ({ page }) => {
      await shotLocator(page.locator('.controls-bar'), '14_ja_controls-bar.png')
    })

    test('15_ja_card-sample', async ({ page }) => {
      await shotLocator(page.locator('.artifact-card').first(), '15_ja_card-sample.png')
    })

    test('16_ja_substat-dropdown', async ({ page }) => {
      // 詳細フィルターパネルを開いてからサブステフィルタボタンをクリック
      await page.locator('.ctrl-advanced-btn').click()
      await page.waitForSelector('.ctrl-advanced-panel', { state: 'visible' })
      await page.locator('.ctrl-advanced-panel .substat-dropdown-btn').click()
      await page.waitForSelector('.substat-dropdown-panel', { state: 'visible' })
      await shot(page, '16_ja_substat-dropdown.png')
    })

    test('17_ja_set-dropdown', async ({ page }) => {
      await page.locator('.controls-bar .substat-dropdown-btn').first().click()
      await page.waitForSelector('.set-dropdown-panel', { state: 'visible' })
      await shot(page, '17_ja_set-dropdown.png')
    })
  })
})
