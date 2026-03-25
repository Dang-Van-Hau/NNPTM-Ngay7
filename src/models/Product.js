const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

productSchema.post('save', async function (doc) {
  const Inventory = mongoose.model('Inventory');
  await Inventory.findOneAndUpdate(
    { product: doc._id },
    { $setOnInsert: { stock: 0, reserved: 0, soldCount: 0 } },
    { upsert: true, new: true }
  );
});

module.exports = mongoose.model('Product', productSchema);
