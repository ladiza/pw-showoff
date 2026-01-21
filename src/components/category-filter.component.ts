import type { Locator } from '@playwright/test';

/**
 * Configuration mapping readable category names to their stable test IDs.
 * This object is used to derive the CategoryName type automatically.
 */
export const Categories = {
  'Vše': 'filter-all',
  'Elektronika': 'filter-electronics',
  'Příslušenství': 'filter-accessories',
  'Oblečení': 'filter-clothing',
} as const;

/**
 * Literal type representing valid category names.
 */
export type CategoryName = keyof typeof Categories;

export class CategoryFilter {
  constructor(private root: Locator) {}

  /**
   * Selects a category by clicking the corresponding button.
   * The input is strictly typed to only allow valid category names defined in CATEGORIES.
   * 
   * @param name The name of the category to select (e.g., 'Elektronika')
   */
  async selectCategory(name: CategoryName): Promise<void> {
    const testId = Categories[name];
    await this.root.getByTestId(testId).click();
  }

  /**
   * Returns the currently active category name.
   */
  async getActiveCategory(): Promise<string> {
    const activeBtn = this.root.locator('.filter-btn.active');
    return (await activeBtn.textContent()) ?? '';
  }
}
