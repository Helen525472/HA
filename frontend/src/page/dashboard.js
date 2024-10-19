import React, { useEffect, useState } from 'react';
import './dashboard.css';
import playerImages from './playerImage'; 
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: '新手訓練村', route: 'training', image: '/picture/training.png' },
  { label: '人事部', route: 'hr', image: '/picture/hr.png' },
  { label: '茶水間', route: 'breakroom', image: '/picture/break.png' },
  { label: '行銷部', route: 'operations', image: '/picture/operation.png' },
  { label: '美食廣場', route: 'foodcourt', image: '/picture/food.png' },
  { label: '福利社', route: 'store', image: '/picture/shop.png' },
];

function Dashboard() {
  const [user, setUser] = useState({});
  const [showDialog, setShowDialog] = useState(false); // 用於顯示選擇視窗
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dashboard/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data);
      checkExperience(data); // 檢查經驗值
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const progressPercentage =
    user.Experience && user.TotalExperience
      ? Math.floor((user.Experience / user.TotalExperience) * 100)
      : 0;

  const checkExperience = (userData) => {
    if (userData.Experience >= userData.TotalExperience) {
      setShowDialog(true); // 顯示彈出視窗
    }
  };

  const handleLevelUp = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/experience/level-up', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user); // 更新用戶資料
        setShowDialog(false); // 關閉彈出視窗
      }
    } catch (error) {
      console.error('Error leveling up:', error);
    }
  };

  const handleRedeemGift = () => {
    navigate('/store'); // 跳轉至商店頁面
  };

  const handleCircleClick = (route) => {
    navigate(`/${route}`); // 處理按下圓圈的導航
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/picture/dashboard.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="profile">
        <img
          src={playerImages[user.ProfilePicture]}
          alt="Player Avatar"
          className="avatar"
        />
        <div>{user.Nickname || 'N/A'}</div>
        <div>LV.{user.Level || 1}</div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{`${progressPercentage}%`}</span>
        </div>
        <button className="profile-btn" onClick={() => navigate('/profile')}>
          PROFILE
        </button>
        <button className="logout-btn" onClick={() => navigate('/login')}>
          LOG OUT
        </button>
      </div>

      <div className="menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => handleCircleClick(item.route)}
          >
            <img src={item.image} alt={item.label} className="menu-image" />
            <div className="menu-label">{item.label}</div>
          </div>
        ))}
      </div>

      {showDialog && (
      <div className="modal">
        <div className="modal-content">
          <h2>CONGRADULATION!</h2>
          <p>經驗值已滿！請選擇升級或兌換禮物</p>
          <button onClick={handleLevelUp}>LEVEL UP</button>
          <button onClick={handleRedeemGift}>GET SOME GIFTS</button>
        </div>
      </div>
   )}
    </div>
  );
}

export default Dashboard;
