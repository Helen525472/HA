const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/data', async (req, reply) => {
    const userId = req.session.userId; 
    console.log('User ID from session(for dashboard):', userId);
    if (!userId) {
      return reply.status(401).send({ error: '未登錄' });
    }
  
    try {
      const user = await User.findById(userId);
      if (user) {
        // 檢查是否存在特定欄位，若不存在則新增
        if (!user.Level) user.Level = 1;
        if (!user.Experience) user.Experience = 0;
        if (!user.TotalExperience) user.TotalExperience = 50;
  
        // 保存更新的使用者資料到資料庫
        await user.save();
  
        reply.send(user);
      } else {
        reply.status(404).send({ error: '用戶未找到' });
      }
    } catch (error) {
      reply.status(500).send({ error: '服務器錯誤' });
    }
  });

module.exports = router;