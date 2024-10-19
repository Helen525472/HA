const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem'); // 確保您有正確的 Problem 模型
const Answer = require('../models/Answer');

// 獲取問題的路由
router.get('/', async (req, res) => {
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

    const problems = await Problem.find(query).sort(sortOption);
    res.json(problems);
  } catch (error) {
    console.error('Error in /api/problem:', error);
    res.status(500).json({ message: error.message });
  }
});

// 獲取特定問題回答的路由
router.get('/:problemId/answers', async (req, res) => {
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
        const { content, type } = req.body;
        const Employee_ID = req.session.userId;

         // 找到最後一個問題並獲取其 Problem_ID
        const lastProblem = await Problem.findOne().sort({ _id: -1 });
        const newProblemId = lastProblem ? lastProblem._id + 1 : 1;
        console.log('新的 Problem_ID:', newProblemId);

        const newProblem = new Problem({
        _id: newProblemId, // 根據當前問題數生成新的Problem_ID
        Employee_ID,
        Problem: content,
        Type: type,
        Launch_Date: new Date().toISOString().split('T')[0], // 當前日期
        Answer: 0
        });

        await newProblem.save();
        console.log('問題成功保存到數據庫');
        res.status(201).json(newProblem);
        console.log('成功響應已發送');
    } catch (error) {
        console.error('Error creating new problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:problemId/answers', async (req, res) => {
    console.log('收到新回答提交請求');
    console.log('問題 ID:', req.params.problemId);
    console.log('請求體:', req.body);
    console.log('Session:', req.session);  // 添加這行來檢查整
    try {
        const { problemId } = req.params;
        const { content } = req.body;
        const Employee_ID = req.session.userId;
        console.log('提交回答 - 員工 ID:', Employee_ID);
        
        if (!Employee_ID) {
            console.log('未找到員工 ID，可能未登錄');
            return res.status(401).json({ message: '未授權，請先登錄' });
        }

      const problem = await Problem.findById(problemId);
      if (!problem) {
        console.log('問題不存在:', problemId);
        return res.status(404).json({ message: '問題不存在' });
      }
  
      problem.Answer += 1;
      await problem.save();
      console.log('問題回答數更新:', problem.Answer);
      
      // 獲取最後一個回答的 Answer_ID
      const lastAnswer = await Answer.findOne({ Problem_ID: problemId }).sort({ Answer_ID: -1 });
      const newAnswerId = lastAnswer ? lastAnswer.Answer_ID + 1 : 100001;
      console.log('新的 Answer_ID:', newAnswerId);

      // 創建 ID
      const ID = `${problemId}_${newAnswerId}`;

      const newAnswer = new Answer({
        Problem_ID: problemId,
        Answer_ID: newAnswerId,
        ID: ID,  // 添加這行
        Employee_ID,
        Answer: content,
        Launch_Date: new Date().toISOString().split('T')[0]
    });
    await newAnswer.save();
    console.log('新回答保存成功:', newAnswer);

    // 更新問題的回答數
    problem.Answer = (problem.Answer || 0) + 1;
    await problem.save();
    console.log('問題回答數更新:', problem.Answer);
  
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error('創建新回答時出錯:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
