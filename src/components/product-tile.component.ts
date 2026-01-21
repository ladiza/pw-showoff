import type { Locator } from '@playwright/test';

export class ProductTile {
  constructor(private root: Locator) {}

  get name(): Locator {
    return this.root.getByTestId('product-name');
  }

  get price(): Locator {
    return this.root.getByTestId('product-price');
  }

  get category(): Locator {
    return this.root.getByTestId('product-category');
  }

  get stockBadge(): Locator {
    return this.root.getByTestId('product-stock');
  }

  get addToCartButton(): Locator {
    return this.root.getByTestId('add-to-cart');
  }

  get detailButton(): Locator {
    return this.root.getByTestId('product-detail');
  }

  async getName(): Promise<string> {
    return (await this.name.textContent()) ?? '';
  }

  async getPrice(): Promise<string> {
    return (await this.price.textContent()) ?? '';
  }

  async getCategory(): Promise<string> {
    return (await this.category.textContent()) ?? '';
  }

  async getPriceAsNumber(): Promise<number> {
    const priceText = await this.getPrice();
    return parseInt(priceText.replace(/\D/g, ''), 10);
  }

  async isInStock(): Promise<boolean> {
    const text = await this.stockBadge.textContent();
    return text?.toLowerCase().includes('skladem') ?? false;
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async openDetail(): Promise<void> {
    await this.detailButton.click();
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async waitFor(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }
}
