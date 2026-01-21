import type { APIResponse, Page, Request } from '@playwright/test';

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `test.user.${timestamp}@example.com`;
}

export function generateRandomString(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
  }).format(price);
}

// ============ API Mocking ============

type MockApiOptions = {
  status?: number;
  body?: unknown;
  contentType?: string;
};

export async function mockApiRoute(
  page: Page,
  urlPattern: string | RegExp,
  options: MockApiOptions,
): Promise<void> {
  const { status = 200, body = {}, contentType = 'application/json' } = options;

  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  });
}

export async function mockEmptyProducts(page: Page): Promise<void> {
  await mockApiRoute(page, '**/api/products', { body: [] });
  await mockApiRoute(page, '**/api/search*', { body: { query: '', count: 0, results: [] } });
}

export async function mockApiError(
  page: Page,
  urlPattern: string | RegExp,
  statusCode = 500,
): Promise<void> {
  await mockApiRoute(page, urlPattern, {
    status: statusCode,
    body: { error: 'Internal Server Error' },
  });
}

export async function mockNetworkFailure(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.route(urlPattern, (route) => route.abort('failed'));
}

// ============ Product Mocking ============

export type MockProduct = {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

export function createMockProduct(overrides: Partial<MockProduct> = {}): MockProduct {
  return {
    id: 1,
    name: 'Test Product',
    price: 1000,
    category: 'electronics',
    inStock: true,
    ...overrides,
  };
}

export function createMockProducts(
  count: number,
  overrides: Partial<MockProduct> = {},
): MockProduct[] {
  return Array.from({ length: count }, (_, i) =>
    createMockProduct({ id: i + 1, name: `Product ${i + 1}`, ...overrides }),
  );
}

export const mockProductPresets = {
  outOfStock: createMockProduct({ name: 'Out of Stock Item', inStock: false }),
  expensive: createMockProduct({ name: 'Luxury Item', price: 99999 }),
  cheap: createMockProduct({ name: 'Budget Item', price: 99 }),
  electronics: createMockProduct({ name: 'Gadget', category: 'electronics' }),
  clothing: createMockProduct({ name: 'T-Shirt', category: 'clothing' }),
  accessories: createMockProduct({ name: 'Phone Case', category: 'accessories' }),
};

export async function mockProducts(page: Page, products: MockProduct[]): Promise<void> {
  await mockApiRoute(page, '**/api/products', { body: products });
}

export async function mockSingleProduct(
  page: Page,
  product: Partial<MockProduct> = {},
): Promise<void> {
  await mockProducts(page, [createMockProduct(product)]);
}

export async function mockOutOfStockProducts(page: Page, count = 3): Promise<void> {
  const products = createMockProducts(count, { inStock: false });
  await mockProducts(page, products);
}

export async function mockMixedStockProducts(page: Page): Promise<void> {
  const products = [
    createMockProduct({ id: 1, name: 'In Stock Item', inStock: true }),
    createMockProduct({ id: 2, name: 'Out of Stock Item', inStock: false }),
    createMockProduct({ id: 3, name: 'Another Available', inStock: true }),
  ];
  await mockProducts(page, products);
}

// ============ Advanced API Interception ============

/**
 * Sets up a route to intercept and modify API requests before they are sent.
 */
export async function modifyAPIRequest(
  page: Page,
  apiMatcher: string | RegExp,
  modifyApiRequest: (request: Request) => {
    url?: string;
    method?: string;
    headers?: { [key: string]: string };
    postData?: string | Buffer;
  },
) {
  await page.route(apiMatcher, async (route) => {
    const originalRequest: Request = route.request();
    const modifiedData = modifyApiRequest(originalRequest);
    await route.continue(modifiedData);
  });
}

/**
 * Sets up a route to intercept and modify API responses after they are received from the server.
 * The callback should return an object compatible with route.fulfill (e.g., { json: data } or { body: data }).
 */
export async function modifyAPIResponse(
  page: Page,
  apiMatcher: string | RegExp,
  modifyApiResponse: (response: APIResponse) => Promise<any>,
) {
  await page.route(apiMatcher, async (route) => {
    const response = await route.fetch();
    const modifiedData = await modifyApiResponse(response);
    await route.fulfill(modifiedData);
  });
}
