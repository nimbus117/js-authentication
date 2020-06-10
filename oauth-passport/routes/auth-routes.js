const router = require('express').Router();
const passport = require('passport');

// login
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// authenticate with google+ api
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

// google callback url
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile/');
});

module.exports = router;
