const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  _id: Number,  // 使用數字類型的 _id
  Employee_ID: {
    type: String,
    required: true
  },
  Problem: {
    type: String,
    required: true
  },
  Type: {
    type: String,
    required: true,
    enum: ['閒聊', '公司', '社團', '投資'] // 假設這些是可能的類型
  },
  Launch_Date: {
    type: String,
    required: true
  },
  Answer: {
    type: Number,
    default: 0
  }
}, {
  _id: false,  // 禁用 Mongoose 自動生成 _id
  collection: 'PROBLEM'  // 指定集合名稱為 'PROBLEM'
});

// 創建一個自增的 _id
ProblemSchema.pre('save', async function(next) {
  //console.log('Pre-save hook triggered for Problem');
  if (!this.isNew) {
    next();
    return;
  }

  try {
    const lastProblem = await this.constructor.findOne({}, {}, { sort: { '_id': -1 } });
    this._id = lastProblem ? lastProblem._id + 1 : 100001;
    console.log('New problem _id:', this._id);
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

const Problem = mongoose.model('Problem', ProblemSchema);

module.exports = Problem;