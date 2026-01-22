import { test, chromium } from '@playwright/test';
import type { Locator } from '@playwright/test';

/**
 * Extends the Playwright Locator interface with custom methods.
 * This declaration merging allows TypeScript to recognize the custom methods
 * on all Locator instances throughout the codebase.
 */
declare module '@playwright/test' {
  interface Locator {
    /**
     * Performs a click action using JavaScript execution instead of Playwright's native click.
     * Useful for bypassing certain click interception issues or when elements are not
     * naturally clickable through the UI.
     * 
     * @returns {Promise<void>} A promise that resolves when the click is executed.
     */
    executeClick(): Promise<void>;
  }
}

// extend at runtime by patching the first locator you encounter
let patched = false;

/**
 * Patches the Locator prototype with custom methods at runtime.
 * This function should be called once with any Locator instance to apply
 * the extensions to all Locator objects in the test suite.
 * 
 * The patching works by:
 * 1. Getting the prototype of the provided Locator instance
 * 2. Adding custom methods directly to that prototype
 * 3. Setting a flag to ensure patching only happens once
 * 
 * @param {Locator} locator - Any Locator instance used to access the prototype.
 */
export function patchLocator(locator: Locator): void {
  if (patched) return;
  
  const proto = Object.getPrototypeOf(locator);
  
  proto.executeClick = async function (this: Locator) {
    await test.step(`Execute JS Click`, async () => {
      await this.evaluate((node: HTMLElement) => node.click());
    });
  };
  
  patched = true;
}