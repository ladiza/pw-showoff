import { test, expect } from '../../src/fixtures/test.fixture';
import { waitForPageLoad } from '@utils';

test.describe('Homepage Tests', () => {
  test('should load homepage and display logo', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveText('Demo Shop');
  });

  test('should display products on load', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    const productsCount = await homePage.getProductsCount();
    expect(productsCount).toBeGreaterThan(0);

    const firstProduct = await homePage.getProduct(0);
    await firstProduct.waitFor();
    expect(await firstProduct.getName()).toBeTruthy();
  });

  test('should display correct product details', async ({ homePage }) => {
    await homePage.goto();
    await waitForPageLoad(homePage.page);

    const products = await homePage.getProducts();
    const laptop = products.find(async p => (await p.getName()).includes('Laptop'));

    if (laptop) {
      expect(await laptop.getCategory()).toBe('electronics');
      expect(await laptop.getPriceAsNumber()).toBeGreaterThan(0);
    }
  });
});
