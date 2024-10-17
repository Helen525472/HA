// 存頭像照片的編號置後端
const express = require('express');
const router = express.Router();
const User = require('../models/User');  // 引入用戶模型


router.post('/save-picture', async (req, res) => {
    const playerId = Number(req.body.playerId); 
    const userId = req.session.userId; 
  
    console.log('User ID from session:', userId); 
    console.log('Player ID to save:', playerId); 
  
    try {
      const result = await User.updateOne(
        { _id: userId },
        { $set: { ProfilePicture: playerId } } 
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
