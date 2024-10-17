const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 檢查暱稱是否存在
router.post('/check', async (req, res) => {
  const { nickname } = req.body;

  try {
    const user = await User.findOne({ Nickname: nickname });
    if (user) {
      console.log('沒有重複暱稱');
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 儲存暱稱
router.post('/save', async (req, res) => {
  const { nickname } = req.body;
  const userId = req.session.userId;

  console.log('User ID from session:', userId); 
  console.log('Nickname to save:', nickname); 

  try {
    const result = await User.updateOne(
      { _id: userId },
      { $set: { Nickname: nickname } } 
    );
    console.log('Update result:', result); 

    if (result.modifiedCount === 1) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: '用戶未找到或未更新' });
    }
  } catch (error) {
    console.error('Error saving player:', error);
    res.status(500).json({ success: false, error: '服務器錯誤' });
  }
});

module.exports = router;
