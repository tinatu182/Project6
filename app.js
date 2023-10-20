const express = require('express');
const userRouter = require('./routes/user');
const app = express();
require('./models').init();

app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// TODO put this code in the controller
app.post('/api/auth/login', (reg, res, next) => {
  console.log(reg.body);
  res.status(201).json({
    message: 'Login Successful!'
  });
});
// TODO put this code in the controller
app.post('/api/auth/signup', (reg, res, next) => {
  console.log(reg.body);
  res.status(201).json({
    message: 'Thing created successfully!'
  });
});
// TODO remove sample code
app.post('/api/stuff', (reg, res, next) => {
  console.log(reg.body);
  res.status(201).json({
    message: 'Thing created successfully!'
  });
});

// app.get('/api/stuff', (req, res, next) => {
//   const stuff = [
//     {
//       _id: 'oeihfzeoi',
//       title: 'My first thing',
//       description: 'All of the info about my first thing',
//       imageUrl: '',
//       price: 4900,
//       userId: 'qsomihvqios',
//     },
//     {
//       _id: 'oeihfzeomoihi',
//       title: 'My second thing',
//       description: 'All of the info about my second thing',
//       imageUrl: '',
//       price: 2900,
//       userId: 'qsomihvqios',
//     },
//   ];
//   res.status(200).json(stuff);
// });
// TODO remove sample code
app.use('/api/stuff', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'My first thing',
      description: 'All of the info about my first thing',
      imageUrl: '',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'My second thing',
      description: 'All of the info about my second thing',
      imageUrl: '',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff);
});
// TODO move in to controller
app.get('/api/sauces', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'My first thing',
      description: 'All of the info about my first thing',
      imageUrl: '',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'My second thing',
      description: 'All of the info about my second thing',
      imageUrl: '',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff);
});

app.use('/api/auth', userRouter);

module.exports = app;