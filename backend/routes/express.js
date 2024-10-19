const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/redemption-records', async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send(user.redeemedGifts || []);
  } catch (error) {
    console.error('Error fetching redemption records:', error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
