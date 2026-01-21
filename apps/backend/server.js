const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: 'MacBook Pro 14"', price: 52990, category: 'electronics', inStock: true },
  { id: 2, name: 'iPhone 15 Pro', price: 33990, category: 'electronics', inStock: true },
  { id: 3, name: 'AirPods Pro', price: 7490, category: 'electronics', inStock: false },
  { id: 4, name: 'Magic Keyboard', price: 2990, category: 'electronics', inStock: true },
  { id: 5, name: 'Magic Mouse', price: 2290, category: 'electronics', inStock: true },
  { id: 6, name: 'Kožené pouzdro na iPhone', price: 1490, category: 'accessories', inStock: true },
  { id: 7, name: 'Silikonový kryt MagSafe', price: 1290, category: 'accessories', inStock: true },
  { id: 8, name: 'USB-C kabel 2m', price: 590, category: 'accessories', inStock: true },
  { id: 9, name: 'Stojan na MacBook', price: 1890, category: 'accessories', inStock: false },
  { id: 10, name: 'Čistící set na displej', price: 390, category: 'accessories', inStock: true },
  { id: 11, name: 'Developer T-shirt', price: 690, category: 'clothing', inStock: true },
  { id: 12, name: 'Mikina s kapucí "Code"', price: 1290, category: 'clothing', inStock: true },
];

const categories = [
  { id: 'electronics', name: 'Elektronika' },
  { id: 'accessories', name: 'Příslušenství' },
  { id: 'clothing', name: 'Oblečení' },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/products', (req, res) => {
  const { category, inStock } = req.query;
  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (inStock === 'true') {
    filtered = filtered.filter(p => p.inStock);
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  const results = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  res.json({ query: q, count: results.length, results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
