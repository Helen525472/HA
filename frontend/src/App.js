import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // 使用 Routes 代替 Switch
import Home from './page/home'; //就是第一頁
import Player from './page/player'; //頭貼
import Login from './page/login'; //登入頁面
import Nickname from './page/nickname'; //暱稱
import Dashboard from './page/dashboard'; //主頁面
import Store from './page/store'; //福利社
import Profile from './page/profile'; //個人簡介頁面
import Village from './page/village';//新手村頁面選項
import Tsmcard from './page/tsmcard';//新手村留言板
import Senpai from './page/senpai';//新手村前人資訊
import Food from './page/food';//美食廣場
import Breakroom from './page/breakroom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/Login" element={<Login />} />    {/* 使用 element 而不是 children */}
        <Route path="/Player" element={<Player />} />
        <Route path="/Nickname" element={<Nickname />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Store" element={<Store />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Village" element={<Village />} />
        <Route path="/Tsmcard" element={<Tsmcard />} />
        <Route path="/Senpai" element={<Senpai />} />
        <Route path="/Food" element={<Food />} />
        <Route path="/breakroom" element={<Breakroom />} />

      </Routes>
    </Router>
  );
}

export default App;