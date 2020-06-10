if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./config/passport-setup');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION_STRING, () => {
  console.log('Connected to mongodb');
});

// App config
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
