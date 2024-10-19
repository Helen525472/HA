// 確認是不是公司員工(登入檢查)

const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/check-user', async (req, res) => {
    const { userId, password } = req.body;
    
    // 密碼格式化為 YYYY-MM-DD 格式
    const formattedPassword = `${parseInt(password.substring(0, 4), 10)}/` +
                          `${parseInt(password.substring(4, 6), 10)}/` +
                          `${parseInt(password.substring(6, 8), 10)}`;
    console.log(`userId: ${userId}, formattedPassword: ${formattedPassword}`);
    
    try {
      // 查找用戶
      const user = await User.findOne({ _id:userId, Date_Of_Birth:formattedPassword});
      console.log(`${user}`)

      if (user) {
        console.log(`I Find you~`)
        if (user.Status === 'Terminated') {
          // 如果 Status 是 Terminated，回傳 exists: false
          return res.json({ exists: false });
        }
        
        // 存到session中
        req.session.userId = userId;
        console.log(`Session userId set: ${req.session.userId}`); 
        
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      res.status(500).json({ error: 'Server error' });
    }
});

router.get('/exp', async (req, reply) => {
  const userId = req.session.userId; // 從 session 獲取 userId
  console.log(`Fetching experience for user: ${userId}`);

  if (!userId) {
    return reply.status(401).send({ error: '未登錄' });
  }

  try {
    const user = await User.findById(userId); // 從資料庫獲取使用者資料
    if (user) {
      reply.send({ Experience: user.Experience, TotalExperience: user.TotalExperience });
    } else {
      reply.status(404).send({ error: '用戶未找到' });
    }
  } catch (error) {
    console.error('Error fetching user experience:', error);
    reply.status(500).send({ error: '伺服器錯誤' });
  }
});

router.get('/answer-status', async (req, res) => {
  try {
    const userId = req.session.userId; // 從 session 獲取使用者 ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '使用者不存在' });
    }

    res.status(200).json({ Answer_ques: user.Answer_ques });
  } catch (error) {
    console.error('Error checking answer status:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

router.get('/check-new-employee', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    console.log('未找到用戶 ID，返回未登錄狀態');
    return res.status(401).json({ message: '未登錄' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log('未找到用戶，返回 404');
      return res.status(404).json({ message: '用戶未找到' });
    }

    const hireDate = new Date(user.Hire_Date.replace(/\//g, '-'));
    const cutoffDate = new Date('2024-09-01');
    const isNewEmployee = hireDate >= cutoffDate;

    res.json({ 
      isNewEmployee: isNewEmployee,
      hireDate: user.Hire_Date
    });
  } catch (error) {
    console.error('檢查新員工狀態時出錯:', error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

router.get('/id', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).json({ message: '未登錄' });
  }
});

module.exports = router;
