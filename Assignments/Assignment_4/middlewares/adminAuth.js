module.exports = function (req, res, next) {
  if (req.session.user && req.session.user.role.includes('admin')) {
    return next();
  }
  req.flash('danger', 'Admin access only.');
  return res.redirect('/login');
};
