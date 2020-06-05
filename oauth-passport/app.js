if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

// auth routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
