// @ts-check
// Fixtures
const { test, expect } = require('./fixtures/loadExtension');
// Helpers
const { navigateToSearchPage } = require('./supports/helpers');

// Tests
test.beforeEach(async ({ page }) => {
  await navigateToSearchPage(page);
});

test('search page', async ({ page }) => {
  const title = await page.title();
  expect(title).toBe('Steam Search');
});
