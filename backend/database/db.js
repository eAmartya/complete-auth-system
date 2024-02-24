const mongoose = require('mongoose');
const { Schema } = mongoose;
// require('dotenv').config();

async function databaseConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Auth');
    console.log('DB connected');
  } catch (err) {
    console.log(err);
  }
};

module.exports = databaseConnection