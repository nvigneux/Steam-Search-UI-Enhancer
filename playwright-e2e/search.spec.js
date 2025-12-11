// @ts-check
// Fixtures
const { test, expect } = require('./fixtures/loadExtension');
// Helpers
const { navigateToSearchPage } = require('./supports/helpers');

// Tests
test.beforeEach(async ({ page }) => {
  await navigateToSearchPage(page);
  // Wait for extension to initialize and apply UI changes
  await page.waitForTimeout(3000);
});

test('search page', async ({ page }) => {
  const title = await page.title();
  expect(title).toBe('Steam Search');
});

test('should add steam-better-ui class to search result rows', async ({ page }) => {
  // Wait for search results to be present
  await page.waitForSelector('.search_result_row', { timeout: 10000 });

  // Check if at least one search result has the steam-better-ui class
  const rowsWithBetterUI = await page.$$eval(
    '.search_result_row.steam-better-ui',
    (elements) => elements.length,
  );

  expect(rowsWithBetterUI).toBeGreaterThan(0);
});

test('should add score UI element to search results', async ({ page }) => {
  // Wait for search results to be present
  await page.waitForSelector('.search_result_row', { timeout: 10000 });

  // Wait a bit more for the extension to apply score UI
  await page.waitForTimeout(2000);

  // Check if score UI elements are present
  const scoreUIElements = await page.$$eval(
    '.steam-better-ui-score-ui',
    (elements) => elements.length,
  );

  expect(scoreUIElements).toBeGreaterThan(0);

  // Verify score UI content format (should contain % and "reviews")
  const firstScoreUI = await page.$('.steam-better-ui-score-ui');
  if (firstScoreUI) {
    const textContent = await firstScoreUI.textContent();
    expect(textContent).toMatch(/\d+%\s*-\s*\d+.*reviews/i);
  }
});

test('should add border style UI to search results', async ({ page }) => {
  // Wait for search results to be present
  await page.waitForSelector('.search_result_row', { timeout: 10000 });

  // Wait a bit more for the extension to apply style UI
  await page.waitForTimeout(2000);

  // Check if border style UI is applied
  const rowsWithBorder = await page.$$eval(
    '.search_result_row.steam-better-ui-border',
    (elements) => elements.length,
  );

  expect(rowsWithBorder).toBeGreaterThan(0);
});

test('should add color classes based on review scores', async ({ page }) => {
  // Wait for search results to be present
  await page.waitForSelector('.search_result_row', { timeout: 10000 });

  // Wait a bit more for the extension to apply color classes
  await page.waitForTimeout(2000);

  // Check if color classes are applied (at least one of the color classes)
  const colorClasses = [
    'color-favorable-1',
    'color-favorable-2',
    'color-favorable-3',
    'color-favorable-4',
    'color-mixed-1',
    'color-negative-1',
    'color-negative-2',
    'color-negative-3',
    'color-negative-4',
  ];

  const colorCounts = await Promise.all(
    colorClasses.map((colorClass) => page.$$eval(
      `.search_result_row.${colorClass}`,
      (elements) => elements.length,
    )),
  );
  const hasColorClass = colorCounts.some((count) => count > 0);

  expect(hasColorClass).toBe(true);
});

test('should modify grid layout for search results with score UI', async ({ page }) => {
  // Wait for search results to be present
  await page.waitForSelector('.search_result_row', { timeout: 10000 });

  // Wait a bit more for the extension to apply UI changes
  await page.waitForTimeout(2000);

  // Check if grid-template-areas style is applied to responsive_search_name_combined
  const containerWithGrid = await page.$eval(
    '.search_result_row .responsive_search_name_combined[style*="grid-template-areas"]',
    (element) => element !== null,
  ).catch(() => false);

  expect(containerWithGrid).toBe(true);
});
