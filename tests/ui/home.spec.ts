import { test, expect } from '../../src/fixtures/test.fixture';
import {
  waitForPageLoad,
  mockEmptyProducts,
  mockNetworkFailure,
  mockProducts,
  mockOutOfStockProducts,
  mockMixedStockProducts,
  createMockProduct,
} from '@utils';

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

test.describe('Homepage Error States', () => {
  test('should show empty state when no products returned', async ({ homePage, page }) => {
    await mockEmptyProducts(page);

    await homePage.goto();
    await waitForPageLoad(page);

    await expect(homePage.noResults).toBeVisible();
    await expect(homePage.noResults).toContainText('Žádné produkty');
    expect(await homePage.getProductsCount()).toBe(0);
  });

  test('should show error message when API fails', async ({ homePage, page }) => {
    await mockNetworkFailure(page, '**/api/products');

    await homePage.goto();
    await waitForPageLoad(page);

    await expect(homePage.noResults).toBeVisible();
    await expect(homePage.noResults).toContainText('Chyba');
  });
});

test.describe('Product Tiles with Mocked Data', () => {
  test('should display out of stock badge for unavailable products', async ({ homePage, page }) => {
    await mockOutOfStockProducts(page, 2);

    await homePage.goto();
    await waitForPageLoad(page);

    const products = await homePage.getProducts();
    expect(products).toHaveLength(2);

    for (const product of products) {
      expect(await product.isInStock()).toBe(false);
      await expect(product.stockBadge).toContainText('Vyprodáno');
      await expect(product.addToCartButton).toBeDisabled();
    }
  });

  test('should display mixed stock states correctly', async ({ homePage, page }) => {
    await mockMixedStockProducts(page);

    await homePage.goto();
    await waitForPageLoad(page);

    const products = await homePage.getProducts();
    expect(products).toHaveLength(3);

    // First product - in stock
    expect(await products[0].isInStock()).toBe(true);
    await expect(products[0].addToCartButton).toBeEnabled();

    // Second product - out of stock
    expect(await products[1].isInStock()).toBe(false);
    await expect(products[1].addToCartButton).toBeDisabled();

    // Third product - in stock
    expect(await products[2].isInStock()).toBe(true);
  });

  test('should display custom product with specific price', async ({ homePage, page }) => {
    const customProduct = createMockProduct({
      name: 'Custom Test Item',
      price: 12345,
      inStock: true,
    });
    await mockProducts(page, [customProduct]);

    await homePage.goto();
    await waitForPageLoad(page);

    const product = await homePage.getProduct(0);
    expect(await product.getName()).toBe('Custom Test Item');
    expect(await product.getPriceAsNumber()).toBe(12345);
  });

  test('should render correct number of mocked tiles', async ({ homePage, page }) => {
    const products = [
      createMockProduct({ id: 1, name: 'Product A' }),
      createMockProduct({ id: 2, name: 'Product B' }),
      createMockProduct({ id: 3, name: 'Product C' }),
      createMockProduct({ id: 4, name: 'Product D' }),
      createMockProduct({ id: 5, name: 'Product E' }),
    ];
    await mockProducts(page, products);

    await homePage.goto();
    await waitForPageLoad(page);

    expect(await homePage.getProductsCount()).toBe(5);
  });
});

test.describe('Price Range Filter', () => {
  const priceVariedProducts = [
    createMockProduct({ id: 1, name: 'Budget Item', price: 500 }),
    createMockProduct({ id: 2, name: 'Mid-range Item', price: 5000 }),
    createMockProduct({ id: 3, name: 'Premium Item', price: 25000 }),
    createMockProduct({ id: 4, name: 'Luxury Item', price: 80000 }),
  ];

  test('should filter products by minimum price', async ({ homePage, page }) => {
    await mockProducts(page, priceVariedProducts);

    await homePage.goto();
    await waitForPageLoad(page);

    // All products visible initially
    expect(await homePage.getProductsCount()).toBe(4);

    // Set min price to 10000 - should hide Budget and Mid-range
    await homePage.setMinPrice(10000);

    expect(await homePage.getProductsCount()).toBe(2);
    const products = await homePage.getProducts();
    expect(await products[0].getName()).toBe('Premium Item');
    expect(await products[1].getName()).toBe('Luxury Item');
  });

  test('should filter products by maximum price', async ({ homePage, page }) => {
    await mockProducts(page, priceVariedProducts);

    await homePage.goto();
    await waitForPageLoad(page);

    // Set max price to 6000 - should hide Premium and Luxury
    await homePage.setMaxPrice(6000);

    expect(await homePage.getProductsCount()).toBe(2);
    const products = await homePage.getProducts();
    expect(await products[0].getName()).toBe('Budget Item');
    expect(await products[1].getName()).toBe('Mid-range Item');
  });

  test('should filter products by price range', async ({ homePage, page }) => {
    await mockProducts(page, priceVariedProducts);

    await homePage.goto();
    await waitForPageLoad(page);

    // Set range 1000-30000 - should show only Mid-range and Premium
    await homePage.setPriceRange(1000, 30000);

    expect(await homePage.getProductsCount()).toBe(2);
    const products = await homePage.getProducts();
    expect(await products[0].getName()).toBe('Mid-range Item');
    expect(await products[1].getName()).toBe('Premium Item');
  });

  test('should show no products when price range excludes all', async ({ homePage, page }) => {
    await mockProducts(page, priceVariedProducts);

    await homePage.goto();
    await waitForPageLoad(page);

    // Set range that excludes all products
    await homePage.setPriceRange(90000, 100000);

    expect(await homePage.getProductsCount()).toBe(0);
    await expect(homePage.noResults).toBeVisible();
  });

  test('should display updated price values in UI', async ({ homePage, page }) => {
    await mockProducts(page, priceVariedProducts);

    await homePage.goto();
    await waitForPageLoad(page);

    await homePage.setPriceRange(5000, 50000);

    const range = await homePage.getDisplayedPriceRange();
    expect(range.min).toContain('5');
    expect(range.max).toContain('50');
  });

  test('should show only luxury items with high min price', async ({ homePage, page }) => {
    const products = [
      createMockProduct({ id: 1, name: 'Cheap Watch', price: 1000 }),
      createMockProduct({ id: 2, name: 'Nice Watch', price: 15000 }),
      createMockProduct({ id: 3, name: 'Rolex', price: 95000 }),
    ];
    await mockProducts(page, products);

    await homePage.goto();
    await waitForPageLoad(page);

    await homePage.setMinPrice(50000);

    expect(await homePage.getProductsCount()).toBe(1);
    const visibleProduct = await homePage.getProduct(0);
    expect(await visibleProduct.getName()).toBe('Rolex');
  });
});
