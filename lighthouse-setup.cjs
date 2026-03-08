const path = require('path');

module.exports = async (browser, context) => {
  const page = await browser.newPage();
  await page.goto(context.url);

  // test-good.json をアップロード
  const fileInput = await page.$('input[type="file"]');
  const fixturePath = path.resolve(__dirname, 'webapp/e2e/fixtures/test-good.json');
  await fileInput.uploadFile(fixturePath);

  // カード表示完了を待機（= localStorage保存完了）
  await page.waitForSelector('.controls-bar', { visible: true, timeout: 60000 });

  // localStorage 書き込み完了を確認
  await page.waitForFunction(
    () => localStorage.getItem('mogumogu-good-data') !== null,
    { timeout: 30000 }
  );

  await page.close();
};
