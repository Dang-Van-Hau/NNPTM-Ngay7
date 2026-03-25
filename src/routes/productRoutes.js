const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'name là bắt buộc (chuỗi không rỗng)' });
    }
    const product = await Product.create({ name: name.trim() });
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
