const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: String,
  expsRequired: Number,
  description: String,
  location: String,
  expirationDate: String,
}, { collection: 'GIFT' });

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;
