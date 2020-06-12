const router = require('express').Router();
const passport = require('passport');

const ifAuthed = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

const ifNotAuthed = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/profile');
  }
};

// login
router.get('/login', ifNotAuthed, (req, res) => {
  res.render('login', { user: req.user });
});

// logout
router.get('/logout', ifAuthed, (req, res) => {
  req.logout();
  res.redirect('/');
});

// authenticate with google+ api
router.get(
  '/google',
  ifNotAuthed,
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

// google callback url
router.get(
  '/google/redirect',
  ifNotAuthed,
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/profile');
  }
);

// authenticate with adfs
router.get(
  '/adfs',
  ifNotAuthed,
  passport.authenticate('saml', {
    failureRedirect: '/auth/login',
  })
);

// adfs callback url
router.post(
  '/adfs/redirect',
  ifNotAuthed,
  passport.authenticate('saml', {
    failureRedirect: '/auth/login',
  }),
  (req, res) => {
    console.log('postResponse');
    res.redirect('/profile');
  }
);

module.exports = router;
