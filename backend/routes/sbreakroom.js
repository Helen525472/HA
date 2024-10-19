const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Msg = require('../models/Msg');

// employee 和 ID 對照檢查
router.get('/employees/:id', async (req, res) => {
    const employeeId = req.session.userId; // 獲取路由參數中的員工 ID

    try {
        // 查詢員工資料
        const employee = await User.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: '找不到對應的員工' });
        }

        // 返回員工信息，合併 First Name 和 Last Name
        res.json({
            name: `${employee['First Name']} ${employee['Last Name']}`,
            birthday: employee.Date_Of_Birth,
            department: employee.Department
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '查詢員工信息時出錯' });
    }
});

// 獲取所有鼓勵訊息 (來自其他員工和主管)
router.get('/allmsg', async (req, res) => {
    const userId = req.session.userId; //當前 login 的 employee id
    try {
        // 查詢 rID 等於當前登錄者 ID 的訊息
        const messages = await Msg.find({ rID: userId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: '獲取訊息時出錯' });
    }
});

// 發送鼓勵訊息 (E -> E)
router.post('/msg', async (req, res) => {
    const { recipient, message } = req.body;
    const userId = req.session.userId; //當前 login 的 employee id
    try {
        // 根據 recipient 查詢員工的資料
        const employee = await User.findById(recipient); // 根據實際字段名稱調整

        if (!employee) {
            return res.status(404).json({ error: '找不到對應的員工' });
        }

        // 合併 First Name 和 Last Name
        const rname = `${employee['First Name']} ${employee['Last Name']}`;

        const newMessage = new Msg({
            sID: userId, // 當前登入的用戶 ID
            rname: rname, // 使用合併的名字
            rID: recipient, // 接收者 ID
            msg: message,
            points: 0, // 根據需要設置點數
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '發送訊息時出錯' });
    }
});

//-----Page below only for supervisor---------

// 獲取所有和該主管為相同Department的員工
router.get('/employees', async (req, res) => {
    const userId = req.session.userId; //當前 login 的 employee id
    try {
        // 查詢主管的資料
        const supervisor = await User.findById(userId); // 使用主管的 userID

        if (!supervisor) {
            return res.status(404).json({ error: '找不到主管' });
        }

        // 根據主管的部門查詢所有相同部門的員工
        const employees = await User.find({ Department: supervisor.Department });

        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '獲取員工時出錯' });
    }
});

// 發送點數和訊息
router.post('/msg_p', async (req, res) => {
    const { recipients, message, points } = req.body; // 獲取 recipients 陣列
    const userId = req.session.userId; //當前 login 的 employee id
    try {
        for (const recipient of recipients) {
            // 根據 recipient 查詢員工的資料
            const employee = await User.findById(recipient);

            if (!employee) {
                return res.status(404).json({ error: `找不到對應的員工 ${recipient}` });
            }

            // 更新該員工的 points
            await User.updateOne({ _id: recipient }, { $inc: { Experience: points } });

            // 合併 First Name 和 Last Name
            const rname = `${employee['First Name']} ${employee['Last Name']}`;

            const newMessage = new Msg({
                sID: userId, // 當前登入的用戶 ID
                rname: rname, // 使用合併的名字
                rID: recipient, // 接收者 ID
                msg: message,
                points: points, // 設置為發送的點數
            });

            await newMessage.save();
        }

        res.status(201).json({ message: '訊息已發送給所有接收者' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '發送訊息時出錯' });
    }
});

module.exports = router; // 確保導出路由