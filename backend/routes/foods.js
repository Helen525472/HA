const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

//獲取所有餐廳資訊
router.get('/all', async (req, res) => {
    try {
      const restaurants = await Food.find();
      res.json(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error.message, error.stack);
      res.status(500).json({ error: '無法獲取餐廳資料' });
    }
  });

  module.exports = router;