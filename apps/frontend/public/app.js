const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'http://backend:3000';

let currentCategory = '';
let currentQuery = '';
let onlyInStock = false;
let priceMin = 0;
let priceMax = 100000;
let allProducts = [];

async function loadProducts() {
  let endpoint = `${API_URL}/api/products`;
  const params = new URLSearchParams();

  if (currentQuery) {
    endpoint = `${API_URL}/api/search`;
    params.set('q', currentQuery);
  } else {
    if (currentCategory) params.set('category', currentCategory);
    if (onlyInStock) params.set('inStock', 'true');
  }

  const url = params.toString() ? `${endpoint}?${params}` : endpoint;

  try {
    const res = await fetch(url);
    const data = await res.json();
    allProducts = currentQuery ? data.results : data;
    filterAndRender();
  } catch (err) {
    document.querySelector('[data-testid="products-grid"]').innerHTML =
      '<div class="no-results" data-testid="no-results">Chyba při načítání produktů</div>';
    document.querySelector('[data-testid="product-count"]').textContent = '';
  }
}

function filterAndRender() {
  const filtered = allProducts.filter(p => p.price >= priceMin && p.price <= priceMax);
  renderProducts(filtered);
}

function renderProducts(products) {
  const container = document.querySelector('[data-testid="products-grid"]');
  const title = document.querySelector('[data-testid="page-title"]');
  const count = document.querySelector('[data-testid="product-count"]');

  if (currentQuery) {
    title.textContent = `Výsledky pro "${currentQuery}"`;
  } else if (currentCategory) {
    const categoryNames = { electronics: 'Elektronika', accessories: 'Příslušenství', clothing: 'Oblečení' };
    title.textContent = categoryNames[currentCategory] || 'Produkty';
  } else {
    title.textContent = 'Produkty';
  }

  count.textContent = `${products.length} produktů`;

  if (products.length === 0) {
    container.innerHTML = '<div class="no-results" data-testid="no-results">Žádné produkty nenalezeny</div>';
    return;
  }

  const icons = { electronics: '💻', accessories: '🎧', clothing: '👕' };

  container.innerHTML = products.map(p => `
    <div class="product-tile" data-testid="product-tile" data-product-id="${p.id}">
      <div class="product-tile__image">${icons[p.category] || '📦'}</div>
      <div class="product-tile__content">
        <div class="product-tile__header">
          <h3 class="product-tile__name" data-testid="product-name">${p.name}</h3>
          <span class="product-tile__badge ${p.inStock ? 'product-tile__badge--in-stock' : 'product-tile__badge--out-of-stock'}" data-testid="product-stock">
            ${p.inStock ? 'Skladem' : 'Vyprodáno'}
          </span>
        </div>
        <div class="product-tile__price" data-testid="product-price">${p.price.toLocaleString('cs-CZ')} Kč</div>
        <div class="product-tile__category" data-testid="product-category">${p.category}</div>
        <div class="product-tile__actions">
          <button class="btn btn--primary" data-testid="add-to-cart" ${!p.inStock ? 'disabled' : ''}>
            ${p.inStock ? 'Přidat do košíku' : 'Nedostupné'}
          </button>
          <button class="btn btn--secondary" data-testid="product-detail">Detail</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Price range slider
const rangeMin = document.querySelector('[data-testid="price-range-min"]');
const rangeMax = document.querySelector('[data-testid="price-range-max"]');
const rangeSelected = document.querySelector('[data-testid="price-range-selected"]');
const minValue = document.querySelector('[data-testid="price-min-value"]');
const maxValue = document.querySelector('[data-testid="price-max-value"]');

function updatePriceRange() {
  const min = parseInt(rangeMin.value);
  const max = parseInt(rangeMax.value);

  if (min > max - 500) {
    if (this === rangeMin) {
      rangeMin.value = max - 500;
    } else {
      rangeMax.value = min + 500;
    }
  }

  priceMin = parseInt(rangeMin.value);
  priceMax = parseInt(rangeMax.value);

  minValue.textContent = priceMin.toLocaleString('cs-CZ') + ' Kč';
  maxValue.textContent = priceMax.toLocaleString('cs-CZ') + ' Kč';

  const percentMin = (priceMin / 100000) * 100;
  const percentMax = (priceMax / 100000) * 100;
  rangeSelected.style.left = percentMin + '%';
  rangeSelected.style.width = (percentMax - percentMin) + '%';

  filterAndRender();
}

rangeMin.addEventListener('input', updatePriceRange);
rangeMax.addEventListener('input', updatePriceRange);

// Initialize range visual
if (rangeMin) {
    updatePriceRange.call(rangeMin);
}

// Search
document.querySelector('[data-testid="search-button"]').addEventListener('click', () => {
  currentQuery = document.querySelector('[data-testid="search-input"]').value;
  loadProducts();
});

document.querySelector('[data-testid="search-input"]').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    currentQuery = e.target.value;
    loadProducts();
  }
});

// Category filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    currentQuery = '';
    document.querySelector('[data-testid="search-input"]').value = '';
    loadProducts();
  });
});

// In stock filter
document.querySelector('[data-testid="filter-in-stock"]').addEventListener('change', (e) => {
  onlyInStock = e.target.checked;
  loadProducts();
});

// Logo click - reset
document.querySelector('[data-testid="logo"]').addEventListener('click', () => {
  currentCategory = '';
  currentQuery = '';
  onlyInStock = false;
  priceMin = 0;
  priceMax = 100000;
  document.querySelector('[data-testid="search-input"]').value = '';
  document.querySelector('[data-testid="filter-in-stock"]').checked = false;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-testid="filter-all"]').classList.add('active');
  rangeMin.value = 0;
  rangeMax.value = 100000;
  updatePriceRange.call(rangeMin);
  loadProducts();
});

loadProducts();
