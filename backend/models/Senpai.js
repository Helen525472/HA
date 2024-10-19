const mongoose = require('mongoose');

const SenpaiSchema = new mongoose.Schema({
  First_Name: String,
  Last_Name: String,
  Position: String,
  Hire_Date: String,
  Email: String,
  Department: String
}, { collection: 'EMPLOYEE' });

module.exports = mongoose.model('Senpai', SenpaiSchema);