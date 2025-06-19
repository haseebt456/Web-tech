// routes/adminProduct.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminAuth = require('../middlewares/adminAuth');
const upload = require('../middlewares/upload');
const path = require('path');

// View all products
router.get('/products', adminAuth, async (req, res) => {
  const products = await Product.find();
  res.render('admin/productList', { products, layout: 'admin/admin-layout' });
});

// Add product form
router.get('/products/add', adminAuth, (req, res) => {
  res.render('admin/addProduct', { layout: 'admin/admin-layout' });
});

// Add product POST
router.post('/products/add', adminAuth, upload.single('image'), async (req, res) => {
  const { name, price, size, department } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  const product = new Product({ name, price, size, department, image });
  await product.save();
  res.redirect('/admin/products');
});

// Edit product form
router.get('/products/edit/:id', adminAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/editProduct', { product, layout: 'admin/admin-layout' });
});

// Edit product POST
router.post('/products/edit/:id', adminAuth, upload.single('image'), async (req, res) => {
  const { name, price, size, department } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateData = { name, price, size, department };
  if (image) updateData.image = image;

  await Product.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin/products');
});

// Delete product
router.get('/products/delete/:id', adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

module.exports = router;
