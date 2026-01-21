import { generateRandomString, waitForPageLoad } from '@utils';
import { expect, test } from '../../src/fixtures/test.fixture';

test.describe('Search Tests', () => {
  test('should search and display matching results', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    await homePage.search('iPhone');

    await expect(homePage.pageTitle).toContainText('iPhone');
    expect(await homePage.getProductsCount()).toBeGreaterThan(0);
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
