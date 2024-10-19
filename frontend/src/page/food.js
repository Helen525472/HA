//美食廣場
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './food.css';

function Food() {
    const navigate = useNavigate();

    // 导航到美食地图页面
    const handleFoodMapClick = () => {
        navigate('/map');
    };

    // 导航到转盘页面
    const handleRouletteClick = () => {
        navigate('/choose');
    };

    // 返回dashboard
    const handleHomeClick = () => {
        navigate('/dashboard');  // 假设首页的路由是 '/'
    };

    return (
        <div
          className="food-plaza-container"
          style={{
            backgroundImage: 'url("/picture/food-plaza.png")', // 请确保有这张背景图片
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
            <h1>歡迎來到美食廣場</h1>
            <button className="food-plaza-button" onClick={handleFoodMapClick}>
                美食地圖
            </button>
            <button className="food-plaza-button" onClick={handleRouletteClick}>
                美食轉盤
            </button>
            <button className="food-plaza-button" onClick={handleHomeClick}>
                返回選單
            </button>
        </div>
    );
}

export default Food;