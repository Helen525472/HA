const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  Problem_ID: { // 問題ID
    type: Number,
    required: true
  },
  Answer_ID: { // 回答ID
    type: Number,
    required: true
  },
  ID: { // 複合ID
    type: String,
    required: true
  },
  Employee_ID: { // 員工ID
    type: String,
    required: true
  },
  Answer: { // 回答內容
    type: String,
    required: true
  },
  Launch_Date: { // 發布日期
    type: String,
    required: true
  }
}, { collection: 'ANSWER' }); // 指定集合名稱為 'ANSWER'

// 添加一個複合索引來確保 ID 的唯一性
AnswerSchema.index({ Problem_ID: 1, Answer_ID: 1 }, { unique: true });

// 在保存之前生成 ID
AnswerSchema.pre('save', function(next) {
  if (this.isNew) {
    this.ID = `${this.Problem_ID}_${this.Answer_ID}`;
    console.log('Creating new Answer:', {
        Problem_ID: this.Problem_ID,
        Answer_ID: this.Answer_ID,
        ID: this.ID,
        Employee_ID: this.Employee_ID,
        Answer: this.Answer,
        Launch_Date: this.Launch_Date
      });
  }else {
    console.log('Updating existing Answer:', {
      ID: this.ID,
      Problem_ID: this.Problem_ID,
      Answer_ID: this.Answer_ID
    });
  }
  next();
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;