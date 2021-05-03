const mongoose = require('mongoose');
const models = require('../models');

class Database {
  static models = models;

  static connect() {
    return mongoose.connect(process.env.APP_DATABASE_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = Database;