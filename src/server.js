require('dotenv').config();

const mongoose = require('mongoose');
require('./models/Inventory');
require('./models/Product');

const app = require('./app');

const PORT = Number(process.env.PORT) || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI required');
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri);
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
