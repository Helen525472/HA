const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 更新經驗值 API
router.post('/update-experience', async (req, reply) => {
  const userId = req.session.userId;
  const { additionalExperience } = req.body; // 新增的經驗值

  try {
    let user = await User.findById(userId);

    if (!user) {
      return reply.status(404).send({ error: '用戶未找到' });
    }

    // 檢查是否存在 Level 和 Experience 欄位，若無則初始化
    if (!user.Level) user.Level = 1;
    if (!user.Experience) user.Experience = 0;
    if (!user.TotalExperience) user.TotalExperience = 50;

    if (user.Experience >= user.TotalExperience) {
      // 如果經驗值已達到總經驗值
      return reply.send({ success: false, message: '經驗值已滿，請選擇升級或兌換禮物' });
    }

    // 累加經驗值
    user.Experience += additionalExperience;

    if (user.Experience >= user.TotalExperience) {
      user.Experience = user.TotalExperience; // 限制經驗值不超過總經驗值
      await user.save();
      return reply.send({
        success: false,
        message: '經驗值已滿，請選擇升級或兌換禮物',
      });
    }

    // 如果經驗值尚未達到總經驗值，則正常保存
    await user.save();
    reply.send({ success: true, user });
  } catch (error) {
    console.error('Error updating experience:', error);
    reply.status(500).send({ error: '服務器錯誤' });
  }
});

// 處理升級 API
router.post('/level-up', async (req, reply) => {
  const userId = req.session.userId;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return reply.status(404).send({ error: '用戶未找到' });
    }

    // 等級提升、經驗值重置、並增加總經驗值需求
    user.Level += 1;
    user.Experience = 0;
    user.TotalExperience += 10; // 每升一級增加 10 點總經驗需求

    await user.save();
    reply.send({ success: true, user });
  } catch (error) {
    console.error('Error leveling up:', error);
    reply.status(500).send({ error: '服務器錯誤' });
  }
});

module.exports = router;