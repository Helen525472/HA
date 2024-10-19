const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const User = require('../models/User');
const Question = require('../models/Question');

// 隨機選取一個問題
router.get('/daily-question', async (req, res) => {
    try {
        // 從資料庫中隨機選擇一個問題
        const randomQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);

        if (randomQuestion.length > 0) {
            const questionData = randomQuestion[0];
            const { question, correct_ans, wrong_ans1, wrong_ans2, wrong_ans3, explanation, fact } = questionData;

            // 將正確答案和錯誤答案混合並隨機打亂順序
            const options = [
                { text: correct_ans, isCorrect: true },
                { text: wrong_ans1, isCorrect: false },
                { text: wrong_ans2, isCorrect: false },
                { text: wrong_ans3, isCorrect: false }
            ];
            shuffleArray(options);

            // 回傳隨機問題和選項
            res.json({
                _id: questionData._id,
                question: question,
                options: options,
                explanation: explanation,
                fact: fact
            });
        } else {
            res.status(404).json({ message: '沒有找到任何問題' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// 隨機打亂選項順序的輔助函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 顯示今天有回答問題，避免重複做答
router.post('/updateAnswerStatus', async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ message: '未經授權的請求' });
  
      // 使用 $set 來設置或更新 Answer_ques 欄位
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { Answer_ques: 1 } }, // 如果不存在會自動新增
        { new: true, upsert: true } // upsert: 如果使用者不存在則創建
      );
  
      res.status(200).json({ success: true, message: '回答狀態已更新', user });
    } catch (error) {
      console.error('Error updating answer status:', error);
      res.status(500).json({ message: '伺服器錯誤' });
    }
  });


cron.schedule('0 0 * * *', async () => {
    try {
      await User.updateMany({}, { $set: { Answer_ques: 0 } });
      console.log('已重置所有使用者的回答狀態');
    } catch (error) {
      console.error('重置回答狀態時發生錯誤:', error);
    }
  });
module.exports = router;