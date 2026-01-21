import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000';

test.describe('Products API', () => {
  test('GET /api/health returns ok status', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/health`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });

  test('GET /api/products returns all products', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/products`);

    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
  });

  test('GET /api/products/:id returns single product', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/products/1`);

    expect(response.ok()).toBeTruthy();
    const product = await response.json();
    expect(product.id).toBe(1);
    expect(product.name).toBe('MacBook Pro 14"');
  });

  test('GET /api/products/:id returns 404 for non-existent product', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/products/999`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBe('Product not found');
  });
});
