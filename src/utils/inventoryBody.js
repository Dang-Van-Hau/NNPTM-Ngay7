const mongoose = require('mongoose');

function parseProductQuantity(body) {
  const { product, quantity } = body || {};
  if (!product || !mongoose.Types.ObjectId.isValid(product)) {
    const err = new Error('product phải là ObjectId hợp lệ');
    err.status = 400;
    throw err;
  }
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty <= 0) {
    const err = new Error('quantity phải là số nguyên dương');
    err.status = 400;
    throw err;
  }
  return { productId: product, qty };
}

module.exports = { parseProductQuantity };
