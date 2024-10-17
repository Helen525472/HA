const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session= require('express-session');
require('dotenv').config();  //加載.env檔裡面的環境變量

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // 允许前端的来源地址
  credentials: true  // 允许前端发送 cookie
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',  
  resave: false,              
  saveUninitialized: false,   
  cookie: { 
    secure: false,
    httpOnly: true,          
    sameSite: 'lax'  }   
}));

// 連結MongoDB
mongoose.connect('mongodb://localhost:27017/hackthon', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const pictureRoutes = require('./routes/picture');
const nickRoutes = require('./routes/nick');
// 使用路由
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/picture', pictureRoutes);
app.use('/api/nick', nickRoutes);

// 啟動服務器
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});