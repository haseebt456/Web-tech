const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Read-only vehicle list
router.get('/', async (req, res) => {
  const vehicles = await Vehicle.find();
  res.render('vehicles', { vehicles });
});

module.exports = router;
