const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  style: String,
  address: String,
}, { collection: 'FOOD' });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;