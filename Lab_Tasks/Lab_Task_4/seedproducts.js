const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/myFullStackApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => console.error(err));

const categories = [
  'Sale', 'Men', 'Women', 'Accessories', 'Footwear',
  "Rewind'85", 'Other Stuff', 'Sustainability'
];

const sizes = Array.from({ length: 19 }, (_, i) => (i + 6).toString()); // 6 - 24
const sampleImages = [
  'product1.jpg', 'product2.jpg', 'product3.jpg', 'product4.jpg',
  'product5.jpg', 'product6.jpg', 'product7.jpg', 'product8.jpg'
];

function generateProducts(category, count = 20) {
  const products = [];
  for (let i = 1; i <= count; i++) {
    products.push({
      name: `${category} Product ${i}`,
      price: (Math.floor(Math.random() * 60 + 10) * 100).toString(),
      size: sizes[Math.floor(Math.random() * sizes.length)],
      department: category,
      image: sampleImages[Math.floor(Math.random() * sampleImages.length)]
    });
  }
  return products;
}

async function seedDatabase() {
  try {
    await Product.deleteMany({});
    console.log('Old products cleared.');

    const allProducts = categories.flatMap(cat => generateProducts(cat, 20));
    await Product.insertMany(allProducts);

    console.log('✅ Sample products inserted successfully!');
  } catch (error) {
    console.error('Error inserting sample products:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
