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

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByTestId('search-button');
    this.logo = page.getByTestId('logo');
    this.pageTitle = page.getByTestId('page-title');
    this.productsGrid = page.getByTestId('products-grid');
    this.noResults = page.getByTestId('no-results');
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
}
