import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { patchLocator } from '../extensions/locator.extension';

type TestFixtures = {
  homePage: HomePage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  page: async ({ page }, use) => {
    patchLocator(page.locator('body'));
    await use(page);
  },
});

export { expect } from '@playwright/test';
