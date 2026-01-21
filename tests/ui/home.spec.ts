import { test, expect } from '../../src/fixtures/test.fixture';
import { waitForPageLoad } from '@utils';

test.describe('Homepage Tests', () => {
  test('should load homepage and display logo', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveText('Demo Shop');
  });

  test('should display products on load', async ({ homePage, page }) => {
    await homePage.goto();
    await waitForPageLoad(page);

    const products = page.locator('.product');
    await expect(products.first()).toBeVisible();
    expect(await products.count()).toBeGreaterThan(0);
  });
});
