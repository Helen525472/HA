const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift'); // 引入 Gift 模型
const User = require('../models/User'); // 引入 User 模型

// 取得所有禮物
router.get('/gift', async (req,res) => {
  try {
    const gifts = await Gift.find();
    res.send(gifts);
  } catch (error) {
    res.status(500).send({ error: '伺服器錯誤' });
  }
});

// 禮物兌換邏輯
router.post('/redeem', async (req, res) => {
  const userId = req.session.userId; 
  const { giftId } = req.body;

  try {
    const gift = await Gift.findById(giftId);
    const user = await User.findById(userId);

    if (user.Experience >= gift.Experience) {
      user.Experience -= gift.Experience;
      await user.save();
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false, error: '點數不足' });
    }
  } catch (error) {
    res.status(500).send({ error: '伺服器錯誤' });
  }
});

module.exports = router;