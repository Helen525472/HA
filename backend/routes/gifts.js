const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift'); // 引入 Gift 模型
const User = require('../models/User'); // 引入 User 模型
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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
  console.log('Gift ID:', giftId);
  console.log('User ID:', userId);

  if (!mongoose.Types.ObjectId.isValid(giftId)) {
    console.log('success: false, error: 無效的禮物 ID' );
  }else{console.log('success')}

  try {

    const gift = await Gift.findById(giftId);
    const user = await User.findById(userId);

    console.log(gift);

    if (user.Experience >= gift.expsRequired) {
      user.Experience -= gift.expsRequired;
      user.redeemedGifts.push({
        giftName: gift.name,
        redeemedDate: new Date(), // 記錄兌換日期
      });
      // 保存用戶信息
      await user.save();
      console.log('save success')
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false, error: '點數不足' });
    }
  } catch (error) {
    res.status(500).send({ error: '伺服器錯誤' });
  }
});

module.exports = router;