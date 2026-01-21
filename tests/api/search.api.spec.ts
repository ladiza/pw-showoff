import { expect, test } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000';

test.describe('Search API', () => {
  test('GET /api/search returns matching products', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/search?q=MacBook`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.query).toBe('MacBook');
    expect(body.count).toBeGreaterThan(0);
    expect(body.results[0].name).toContain('MacBook');
  });

  test('GET /api/search returns empty for no matches', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/search?q=xyz123nonexistent`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.count).toBe(0);
    expect(body.results).toHaveLength(0);
  });

  test('GET /api/search returns 400 without query param', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/search`);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });

  test('GET /api/products filters by category', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/products?category=accessories`);

    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(products.every((p: { category: string }) => p.category === 'accessories')).toBeTruthy();
  });
});
