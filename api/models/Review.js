const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  psychologist: {
    type: String,
    default: ''
  },
  timeStamp: {
    type: Date,
    default: Date.now()
  },
  review: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  grade: {
    type: Number,
    default: -1
  }
});

module.exports = mongoose.model('Review', ReviewSchema);