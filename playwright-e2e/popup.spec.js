const { test, expect } = require('./fixtures/loadExtension');

test.beforeEach(async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
});

test('popup page', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Steam Better UI');
});
