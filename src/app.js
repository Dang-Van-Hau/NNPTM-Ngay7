const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/products', productRoutes);
app.use('/api/inventories', inventoryRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy route' });
});

app.use((err, _req, res, _next) => {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = status === 500 ? 'Lỗi máy chủ' : err.message;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ message });
});

module.exports = app;
