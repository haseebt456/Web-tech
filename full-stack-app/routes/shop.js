let express = require('express')
let router  = express.Router()
let Product = require('../models/Product')
const Order = require('../models/Order');

router.get('/cart', async (req, res) => {
  let cart = req.session.cart || [];
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render('cart', { cart, total });
});

router.get('/add-cart/:id', async (req, res) => {
  const productId = req.params.id;
  let cart = req.session.cart || [];

  const existingItem = cart.find(item => item.product === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = await Product.findById(productId);
    cart.push({
      product: productId,
      name: product.name,
      price: Number(product.price),
      size: product.size,
      quantity: 1
    });
  }

  req.session.cart = cart;
  res.redirect('/shop/cart');
});


router.get('/remove-cart/:id', (req, res) => {
  const productId = req.params.id;
  let cart = req.session.cart || [];

  cart = cart.filter(item => item.product !== productId);

  req.session.cart = cart;
  res.redirect('/shop/cart');
});

router.get('/update-cart/:id', (req, res) => {
  let cart = req.session.cart || [];
  const productId = req.params.id;
  const action = req.query.action;

  cart = cart.map(item => {
    if (item.product === productId) {
      if (action === 'increase') item.quantity++;
      if (action === 'decrease' && item.quantity > 1) item.quantity--;
    }
    return item;
  });

  req.session.cart = cart;
  res.redirect('/shop/cart');
});

// GET checkout page
router.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  const user = req.session.user || null; 
  if (cart.length === 0) {
    req.flash('danger', 'Your cart is empty.');
    return res.redirect('/shop/cart');
  }
  res.render('checkout', { cart,user });
});

// POST checkout form
router.post('/checkout', async (req, res) => {
  const cart = req.session.cart || [];
  const { address} = req.body;


  if (!cart.length) {
    req.flash('danger', 'Cart is empty.');
    return res.redirect('/shop/cart');
  }
total=0;
  const orderItems = [];

  for (let item of cart) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const itemTotal = parseFloat(product.price) * item.quantity;
    total += itemTotal;
    console.log(total);
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      size: item.size,
      quantity: item.quantity
    });
  }
const userId = req.session.user ? req.session.user._id : null;
  //const userId = req.session.user._id || null;
  console.log("userID",userId)
  const order = new Order({
    user: userId,
    items: orderItems,
    total,
    address
  });

  await order.save();

  res.clearCookie('cart');
  req.flash('success', 'Order placed successfully!');
  req.session.cart = [];
  res.redirect('/shop')
});

router.get('/:page?', async (req, res, next) => {
  const categories = [
    'Sale', 'Men', 'Women', 'Accessories', 'Footwear',
    "Rewind'85", 'Other Stuff', 'Sustainability'
  ];

  console.log('Inside shop page route');

  let page = Number(req.params.page) || 1;
  const selectedCategory = req.query.category || '';

  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  
  const filter = selectedCategory ? { department: selectedCategory } : {};

  const products = await Product.find(filter).skip(skip).limit(pageSize);
  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / pageSize);

  return res.render('shop', {
    products,
    page,
    pageSize,
    totalPages,
    categories,
    selectedCategory
  });
});

module.exports = router