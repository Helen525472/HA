const express = require('express');
const router = express.Router();
const User = require('../models/User');

async function addExperience(userId, amount) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('使用者不存在');
    }

    // 檢查是否存在 Level 和 Experience 欄位，若無則初始化
    if (user.Level === undefined) user.Level = 1;
    if (user.Experience === undefined) user.Experience = 0;
    if (user.TotalExperience === undefined) user.TotalExperience = 50;

    // 累加經驗值
    user.Experience += amount;

    // 檢查是否達到升級條件
    while (user.Experience >= user.TotalExperience) {
      user.Level += 1;
      user.Experience -= user.TotalExperience;
      user.TotalExperience += 10; // 每升一級增加 10 點總經驗需求
    }

    await user.save();
    return user;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
}

// 更新經驗值 API
router.post('/update-experience', async (req, res) => {
  const userId = req.session.userId;
  const { additionalExperience } = req.body; // 新增的經驗值

  try {
    const user = await addExperience(userId, additionalExperience);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: '服務器錯誤' });
  }
});

// 處理升級 API
router.post('/level-up', async (req, res) => {
  const userId = req.session.userId;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: '用戶未找到' });
    }

    // 等級提升、經驗值重置、並增加總經驗值需求
    user.Level += 1;
    user.Experience = 0;
    user.TotalExperience += 10; // 每升一級增加 10 點總經驗需求

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error leveling up:', error);
    res.status(500).json({ error: '服務器錯誤' });
  }
});

// 增加經驗值 API
router.post('/add', async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.session.userId;

    const user = await addExperience(userId, amount);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

module.exports = {
  addExperience,
  router
};