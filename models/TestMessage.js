const { Schema, model } = require('mongoose');

const schema = new Schema({
  message: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('TestMessage', schema);