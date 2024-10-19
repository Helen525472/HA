const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  sID: String, //sender id
  rname: String, //receiver name
  rID: String, //receiver id
  points: Number,
  msg : String,
  time: { type: Date, default: Date.now }
}, { collection: 'MESSAGE' });

const Msg = mongoose.model('Msg', msgSchema);

module.exports = Msg;