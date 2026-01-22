import { test, expect } from '../../src/fixtures/test.fixture';
import { smart } from '../../packages/utils/smartLocator';

test.describe('SmartLocator Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Standard click should fail when element is obscured', async ({ page }) => {
    const obscuredButton = page.getByTestId('obscured-button');
    const status = page.getByTestId('click-result');

    // Attempting a standard click should fail or hit the overlay instead
    // By default Playwright will throw an error if it can't hit the target element
    // because it's intercepted by the overlay.
    
    // We expect this to fail with an "overlay intercepts pointer events" error
    const clickPromise = obscuredButton.click({ timeout: 500 });
    
    await expect(clickPromise).rejects.toThrow(/intercepts pointer events/i);
    
    // Verify that the overlay was actually clicked if we manually click the coordinates
    // but here we just want to show that standard .click() on the locator fails.
    await expect(status).toHaveText('Waiting...');
  });

  test('With executeClick injected to the Locator prototype, test should succeed when element is obscured', async ({ page }) => {
    const obscuredButton = page.getByTestId('obscured-button');
    const status = page.getByTestId('click-result');

    // Using the custom executeClick method to bypass the overlay
    await obscuredButton.executeClick();
    await expect(status).toHaveText('Clicked!');
  });
});
