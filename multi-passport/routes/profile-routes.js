const router = require('express').Router();

const ifAuthed = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

router.get('/', ifAuthed, (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = router;
