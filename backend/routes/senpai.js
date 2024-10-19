const express = require('express');
const router = express.Router();
const Senpai = require('../models/Senpai');

// 获取特定部门的前辈信息
router.get('/:department', async (req, res) => {
  const { department } = req.params;
  
  //console.log('Requested department:', department);

  try {
    const cutoffDate = new Date('2024/9/1');
    const departmentRegex = new RegExp(`^${department}`, 'i');

    const senpai = await Senpai.find({
        Department: departmentRegex
      });
      //console.log(senpai.length);
      // 如果找到資料，則過濾日期比cutoffDate早的資料
      const filteredSenpai = senpai.filter(s => {
        // 將字串形式的 Hire_Date 轉換為 Date 對象
        const hireDate = new Date(s.Hire_Date);
        // 比較 Hire_Date 是否早於 cutoffDate
        return hireDate < cutoffDate;
      });
    
      // 檢查篩選後的結果並返回
      if (filteredSenpai.length > 0) {
        res.json(filteredSenpai);  // 返回符合條件的資料
      } else {
        res.status(404).json({ message: '未找到該部門的前輩信息' });  // 沒找到資料
      }
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      res.status(500).json({ error: '伺服器錯誤' });  // 錯誤處理
    }
});

module.exports = router;