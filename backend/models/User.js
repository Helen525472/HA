const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,  
  Date_Of_Birth: String,  
  ProfilePicture: Number,
  Nickname:String,
  Status: String
}, { collection: 'employee' });

const User = mongoose.model('User', userSchema);

module.exports = User;