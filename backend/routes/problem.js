const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem'); // 確保您有正確的 Problem 模型
const Answer = require('../models/Answer');

// 獲取問題的路由
router.get('/', async (req, res) => {
  //console.log('Received request for problems. Query:', req.query);
  try {
    const { type, sort } = req.query;
    let query = {};
    
    // 如果指定了類型且不是 'all'，則添加到查詢中
    if (type && type !== 'all') {
      query.Type = type;
    }

    // 設置排序選項
    let sortOption = {};
    if (sort === 'oldest') {
      sortOption = { Launch_Date: 1 };
    } else {
      sortOption = { Launch_Date: -1 }; // 默認最新到最舊
    }

    //console.log('Sort option:', sortOption);

    const problems = await Problem.find(query).sort(sortOption);
    //console.log(`Found ${problems.length} problems`);
    res.json(problems);
  } catch (error) {
    console.error('Error in /api/problem:', error);
    res.status(500).json({ message: error.message });
  }
});

// 獲取特定問題回答的路由
router.get('/:problemId/answers', async (req, res) => {
    console.log('Received request for answers. Problem ID:', req.params.problemId);
    try {
        const { problemId } = req.params;
        console.log('Querying database for answers to Problem_ID:', problemId);
        const answers = await Answer.find({ Problem_ID: problemId })
                                    .sort({ Launch_Date: -1, Answer_ID: -1 });
        console.log(`Found ${answers.length} answers for problem ${problemId}`);
        res.json(answers);
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });

// 提交問題的路由
router.post('/', async (req, res) => {
try {
    const { Problem, Type } = req.body;
    const Employee_ID = req.session.user.employeeId; // 假設用戶ID存儲在session中

    // 獲取該類型的問題數量
    const problemCount = await Problem.countDocuments({ Type });

    const newProblem = new Problem({
    Problem_ID: problemCount + 1, // 根據當前問題數生成新的Problem_ID
    Employee_ID,
    Problem,
    Type,
    Launch_Date: new Date().toISOString().split('T')[0], // 當前日期
    Answer: 0
    });

    await newProblem.save();
    res.status(201).json(newProblem);
} catch (error) {
    console.error('Error creating new problem:', error);
    res.status(500).json({ message: 'Internal server error' });
}
});

module.exports = router;
