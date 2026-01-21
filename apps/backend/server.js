const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: 'Laptop', price: 25000, category: 'electronics' },
  { id: 2, name: 'Keyboard', price: 1500, category: 'electronics' },
  { id: 3, name: 'Mouse', price: 800, category: 'electronics' },
  { id: 4, name: 'Coffee Mug', price: 250, category: 'accessories' },
  { id: 5, name: 'Desk Lamp', price: 900, category: 'accessories' },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    return res.json(products.filter(p => p.category === category));
  }
  res.json(products);
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
