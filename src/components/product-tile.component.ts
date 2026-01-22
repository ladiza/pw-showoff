import type { Locator } from '@playwright/test';

export class ProductTile {
  readonly name: Locator;
  readonly price: Locator;
  readonly category: Locator;
  readonly stockBadge: Locator;
  readonly addToCartButton: Locator;
  readonly detailButton: Locator;

  constructor(private root: Locator) {
    this.name = this.root.getByTestId('product-name');
    this.price = this.root.getByTestId('product-price');
    this.category = this.root.getByTestId('product-category');
    this.stockBadge = this.root.getByTestId('product-stock');
    this.addToCartButton = this.root.getByTestId('add-to-cart');
    this.detailButton = this.root.getByTestId('product-detail');
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
