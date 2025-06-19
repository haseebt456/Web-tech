const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const adminAuth = require('../middlewares/adminAuth');
const upload = require('../middlewares/upload');

// View all vehicles (admin)
router.get('/vehicles', adminAuth, async (req, res) => {
  const vehicles = await Vehicle.find();
  res.render('admin/vehicleList', {
    layout: 'admin/admin-layout',
    vehicles
  });
});

// Add vehicle form
router.get('/vehicles/add', adminAuth, (req, res) => {
  res.render('admin/addVehicle', {
    layout: 'admin/admin-layout'
  });
});

// Add vehicle POST
router.post('/vehicles/add', adminAuth, upload.single('image'), async (req, res) => {
  const { name, brand, price, type } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  const vehicle = new Vehicle({ name, brand, price, type, image });
  await vehicle.save();
  res.redirect('/admin/vehicles');
});

// Edit vehicle form
router.get('/vehicles/edit/:id', adminAuth, async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  res.render('admin/editVehicle', {
    layout: 'admin/admin-layout',
    vehicle
  });
});

// Edit vehicle POST
router.post('/vehicles/edit/:id', adminAuth, upload.single('image'), async (req, res) => {
  const { name, brand, price, type } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateData = { name, brand, price, type };
  if (image) updateData.image = image;

  await Vehicle.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin/vehicles');
});

// Delete vehicle
router.get('/vehicles/delete/:id', adminAuth, async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.redirect('/admin/vehicles');
});

module.exports = router;
