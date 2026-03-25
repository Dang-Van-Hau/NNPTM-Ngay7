const express = require('express');
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const { parseProductQuantity } = require('../utils/inventoryBody');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const list = await Inventory.find().populate('product').sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'id inventory không hợp lệ' });
    }
    const inv = await Inventory.findById(id).populate('product');
    if (!inv) {
      return res.status(404).json({ message: 'Không tìm thấy inventory' });
    }
    res.json(inv);
  } catch (e) {
    next(e);
  }
});

router.post('/add-stock', async (req, res, next) => {
  try {
    const { productId, qty } = parseProductQuantity(req.body);
    const inv = await Inventory.findOneAndUpdate(
      { product: productId },
      { $inc: { stock: qty } },
      { new: true }
    ).populate('product');
    if (!inv) {
      return res.status(404).json({ message: 'Không tìm thấy inventory cho product này' });
    }
    res.json(inv);
  } catch (e) {
    next(e);
  }
});

router.post('/remove-stock', async (req, res, next) => {
  try {
    const { productId, qty } = parseProductQuantity(req.body);
    const inv = await Inventory.findOneAndUpdate(
      { product: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    ).populate('product');
    if (!inv) {
      return res.status(400).json({
        message: 'Không thể giảm stock: không đủ tồn hoặc chưa có inventory',
      });
    }
    res.json(inv);
  } catch (e) {
    next(e);
  }
});

router.post('/reservation', async (req, res, next) => {
  try {
    const { productId, qty } = parseProductQuantity(req.body);
    const inv = await Inventory.findOneAndUpdate(
      { product: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty, reserved: qty } },
      { new: true }
    ).populate('product');
    if (!inv) {
      return res.status(400).json({
        message: 'Không thể đặt chỗ: không đủ stock hoặc chưa có inventory',
      });
    }
    res.json(inv);
  } catch (e) {
    next(e);
  }
});

router.post('/sold', async (req, res, next) => {
  try {
    const { productId, qty } = parseProductQuantity(req.body);
    const inv = await Inventory.findOneAndUpdate(
      { product: productId, reserved: { $gte: qty } },
      { $inc: { reserved: -qty, soldCount: qty } },
      { new: true }
    ).populate('product');
    if (!inv) {
      return res.status(400).json({
        message: 'Không thể ghi nhận bán: không đủ reserved hoặc chưa có inventory',
      });
    }
    res.json(inv);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
