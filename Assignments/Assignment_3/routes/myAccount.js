let express = require('express');
let router = express.Router();
const Order = require('../models/Order');

// Ensure only logged-in users can access
router.get('/', async (req, res, next) => {
  try {
    if (!req.session.user) {
      req.flash('danger', 'You must be logged in to view your account');
      return res.redirect('/login');
    }

    const user = req.session.user;

    // Find orders belonging only to the logged-in user
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

    res.render('myAccount', { user, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
