import { Page, Locator } from '@playwright/test';
import { ProductTile } from '../components';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly logo: Locator;
  readonly pageTitle: Locator;
  readonly productsGrid: Locator;
  readonly noResults: Locator;
  readonly priceRangeMin: Locator;
  readonly priceRangeMax: Locator;
  readonly priceMinValue: Locator;
  readonly priceMaxValue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByTestId('search-button');
    this.logo = page.getByTestId('logo');
    this.pageTitle = page.getByTestId('page-title');
    this.productsGrid = page.getByTestId('products-grid');
    this.noResults = page.getByTestId('no-results');
    this.priceRangeMin = page.getByTestId('price-range-min');
    this.priceRangeMax = page.getByTestId('price-range-max');
    this.priceMinValue = page.getByTestId('price-min-value');
    this.priceMaxValue = page.getByTestId('price-max-value');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async getProducts(): Promise<ProductTile[]> {
    const tiles = await this.page.getByTestId('product-tile').all();
    return tiles.map(tile => new ProductTile(tile));
  }

  async getProduct(index: number): Promise<ProductTile> {
    return new ProductTile(this.page.getByTestId('product-tile').nth(index));
  }

  async getProductsCount(): Promise<number> {
    return this.page.getByTestId('product-tile').count();
  }

  async setPriceRange(min: number, max: number) {
    await this.priceRangeMin.fill(String(min));
    await this.priceRangeMin.dispatchEvent('input');
    await this.priceRangeMax.fill(String(max));
    await this.priceRangeMax.dispatchEvent('input');
  }

  async setMinPrice(value: number) {
    await this.priceRangeMin.fill(String(value));
    await this.priceRangeMin.dispatchEvent('input');
  }

  async setMaxPrice(value: number) {
    await this.priceRangeMax.fill(String(value));
    await this.priceRangeMax.dispatchEvent('input');
  }

  async getDisplayedPriceRange(): Promise<{ min: string; max: string }> {
    return {
      min: await this.priceMinValue.textContent() ?? '',
      max: await this.priceMaxValue.textContent() ?? '',
    };
  }
}
