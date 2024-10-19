const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session= require('express-session');
require('dotenv').config();  //加載.env檔裡面的環境變量
const mongoURI = process.env.MONGODB_URI;
const sessionSECRET = process.env.SESSION_SECRET;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true 
}));
app.use(express.json());

app.use(session({
  secret: sessionSECRET,  
  resave: false,              
  saveUninitialized: false,   
  cookie: { 
    secure: false,
    httpOnly: true,          
    sameSite: 'lax'  }   
}));

// 連結MongoDB 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const pictureRoutes = require('./routes/picture');
const nickRoutes = require('./routes/nick');
const dashRoutes = require('./routes/dashboard');
const giftRoutes = require('./routes/gifts');
const expressRoutes = require('./routes/express');
const quesRoutes = require('./routes/ques');
const expRoutes = require('./routes/experience');
const senpaiRoutes = require('./routes/senpai');
const foodRoutes = require('./routes/foods');
const signRoutes = require('./routes/sign');

// 使用路由
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/picture', pictureRoutes);
app.use('/api/nick', nickRoutes);
app.use('/api/dashboard', dashRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/express', expressRoutes);
app.use('/api/ques', quesRoutes);
app.use('/api/experience',expRoutes);
app.use('/api/senpai', senpaiRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/sign', signRoutes);

// 啟動服務器
app.listen( 3001, () => {
  console.log('Server is running on port 3001');
});