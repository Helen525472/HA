const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cron = require('node-cron');

// 獲取簽到狀態
router.get('/status', async (req, res) => {
  const userId = req.session.userId;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ canSignIn: false, message: '用戶不存在' });
    }
    const canSignIn = user.signin !== 1; 

    res.json({ canSignIn });

  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 執行簽到
router.post('/', async (req, res) => {
  const userId = req.session.userId; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: '用戶不存在' });
    }

    const now = new Date();
    const hour = now.getHours();

    if (hour >= 9) {
      return res.status(400).json({ success: false, message: '超過簽到時間' });
    }

    if (user.signedInToday) {
      return res.status(400).json({ success: false, message: '今天已經簽到過了' });
    }

    // 簽到成功
    user.Experience += 3;
    user.signin = 1;
    await user.save();

    res.json({ success: true, message: '簽到成功，獲得3點經驗值' });
  } catch (error) {
    console.error('簽到錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// 每天凌晨重置簽到狀態
cron.schedule('0 0 * * *', async () => {
  try {
    await User.updateMany({}, { signedin: 0 });
    console.log('每日簽到狀態已重置');
  } catch (error) {
    console.error('重置簽到狀態錯誤:', error);
  }
});

module.exports = router;




