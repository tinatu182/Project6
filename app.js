const express = require('express');
const path = require('path') // used to pathing the app
const userRouter = require('./routes/user');
const sauceRouter = require('./routes/sauce');
const app = express();
require('./models').init();
const bodyParser = require('body-parser');


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/sauces', sauceRouter);
app.use('/api/auth', userRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

module.exports = app;