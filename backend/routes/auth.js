const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/check-first-login', async (req, res) => {
    console.log('Session data:', req.session);  // 打印 session 的内容
    const userId = req.session.userId;
    console.log("User ID from session in check-first-login:", userId);

  try {
    const user = await User.findOne({ _id: userId });

    const isFirstLogin = !user.ProfilePicture;
    console.log(`User ID: ${userId}, isFirstLogin: ${isFirstLogin}`);

    return res.json({
        exists: true,
        isFirstLogin: isFirstLogin,  
        profilePicture: user.ProfilePicture || '' 
      });
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
