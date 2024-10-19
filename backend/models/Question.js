// Question.js
const mongoose = require('mongoose');

// Define the schema for questions
const questionSchema = new mongoose.Schema({
  _id: Number,
  country: String,
  question: String,
  correct_ans: String,
  wrong_ans1: String,
  wrong_ans2: String,
  wrong_ans3: String,
  explanation: String,
}, { collection: 'QUESTION' });

// Create a model for the QUESTION collection
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
