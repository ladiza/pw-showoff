import { test, expect } from '../../src/fixtures/test.fixture';
import { waitForPageLoad, generateRandomString } from '@utils';

test.describe('Search Tests', () => {
  test('should search and display matching results', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    await homePage.search('Laptop');

    await expect(homePage.pageTitle).toContainText('Laptop');
    expect(await homePage.getProductsCount()).toBe(1);
  });

  test('should show no results message for gibberish', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    const randomQuery = generateRandomString(15);
    await homePage.search(randomQuery);

    await expect(homePage.noResults).toBeVisible();
    await expect(homePage.noResults).toContainText('Žádné produkty');
  });
});
