const mongoose = require('mongoose');
// const mongodbErrorHandler = require('mongoose-mongodb-errors');

exports.init = async () => {
  const dbCredentials = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}`;
  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;
  const uri = `mongodb+srv://${dbCredentials}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    // mongoose.plugin(mongodbErrorHandler);
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.log('Unable to connect to MongoDB Atlas!', error);
  }
};