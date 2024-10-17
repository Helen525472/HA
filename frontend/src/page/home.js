import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function home() {
  return (
    <div
      style={{
        backgroundImage: 'url("/picture/home.png")',
        backgroundSize: 'cover', // 确保背景图片覆盖整个页面
        backgroundPosition: 'center', // 保证图片在页面中央
        backgroundRepeat: 'no-repeat', // 防止图片重复
        height: '100vh',
        width: '100vw',
        display: 'flex', // 使用flex布局确保内容居中
        justifyContent: 'center', // 水平居中
        alignItems: 'center',
      }}
    >
      <div className="game-container">
        <h1>Office Escape</h1>
        <Link to="/Login">
        <button className="play-button">Play</button>
        </Link>
      </div>
    </div>
  );
}

export default home;