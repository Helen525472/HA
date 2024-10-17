// 確認是不是公司員工(登入檢查)

const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/check-user', async (req, res) => {
    const { userId, password } = req.body;
    
    // 密碼格式化為 YYYY-MM-DD 格式
    const formattedPassword = `${password.substring(0, 4)}-${password.substring(4, 6)}-${password.substring(6, 8)}`;
  
    try {
      // 查找用戶
      const user = await User.findOne({ _id: userId, Date_Of_Birth: formattedPassword });
  
      if (user) {
        if (user.Status === 'Terminated') {
          // 如果 Status 是 Terminated，回傳 exists: false
          return res.json({ exists: false });
        }
        
        //存到session中
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

module.exports = router;