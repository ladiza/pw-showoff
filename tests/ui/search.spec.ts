import { test, expect } from '../../src/fixtures/test.fixture';
import { waitForPageLoad, generateRandomString } from '@utils';

test.describe('Search Tests', () => {
  test('should search and display matching results', async ({ homePage, page }) => {
    await homePage.goto();
    await waitForPageLoad(page);

    await homePage.search('Laptop');

    await expect(page.locator('#pageTitle')).toContainText('Laptop');
    await expect(page.locator('.product')).toHaveCount(1);
  });

  test('should show no results message for gibberish', async ({ homePage, page }) => {
    await homePage.goto();
    await waitForPageLoad(page);

    const randomQuery = generateRandomString(15);
    await homePage.search(randomQuery);

    await expect(page.locator('.no-results')).toBeVisible();
    await expect(page.locator('.no-results')).toContainText('Žádné produkty');
  });
});
