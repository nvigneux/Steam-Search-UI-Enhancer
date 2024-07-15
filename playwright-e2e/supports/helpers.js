/**
 * Navigates to the summon page with the specified summon ID.
 *
 * @param {import('playwright').Page} page - The page object representing the web page.
 * @param {number} summonId - The ID of the summon page to navigate to.
 * @returns {Promise<void>} - A promise that resolves once the navigation is complete.
 */
const navigateToSearchPage = async (page) => {
  await page.goto('https://store.steampowered.com/search/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // wait for page loading
};

module.exports = {
  navigateToSearchPage,
};
