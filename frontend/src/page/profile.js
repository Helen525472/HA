import React, { useEffect, useState } from 'react';
import './profile.css'; // 引入 CSS 樣式
import playerImages from './playerImage'; // 頭像映射表

function Profile() {
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('usage'); // 追蹤當前的分頁
  const [redemptionRecords, setRedemptionRecords] = useState([]); // 儲存兌換紀錄

  // 從後端取得用戶資料與兌換紀錄
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch('http://localhost:3001/api/dashboard/data', {
          credentials: 'include',
        });
        const userData = await userResponse.json();
        setUser(userData);

        const recordsResponse = await fetch('http://localhost:3001/api/express/redemption-records', {
          credentials: 'include',
        });
        const recordsData = await recordsResponse.json();
        setRedemptionRecords(recordsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();
  }, []);

  // 切換分頁
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
      <div className="profile-container">
        <div className="home-icon" onClick={() => (window.location.href = '/dashboard')}>
          <img src="/icon/home.png" alt="Home" />
        </div>

        <div className="profile-header">
          <img
            src={playerImages[user.ProfilePicture] || '/default-avatar.png'}
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>{user.Nickname || 'N/A'}</h2>
            <p>LV.{user.Level || 1} </p>
            <p>EXPERIENCE: {user.Experience || 0} / {user.TotalExperience || 50}</p>
          </div>
        </div>

        <div className="tabs">
          <button
            onClick={() => handleTabChange('usage')}
            className={`tab-button ${activeTab === 'usage' ? 'active' : ''}`}
          >
            使用方式
          </button>
          <button
            onClick={() => handleTabChange('records')}
            className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
          >
            兌換紀錄
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'usage' && (
            <div className="usage-container">
              <p>
                歡迎使用本系統！以下是如何使用：
                <br />1. 點選「PROFILE」按鈕查看個人資訊。
                <br />2. 前往商店選擇可兌換的禮物，需根據經驗值進行兌換。
                <br />3. 在「兌換紀錄」頁面檢視您已經兌換的物品清單及詳細資訊。
                <br />4. 達到等級上限時可選擇升級或兌換禮物。
                <br />
                感謝使用，祝您愉快！
              </p>
            </div>
          )}

          {activeTab === 'records' && (
            <table className="record-table">
              <thead>
                <tr>
                  <th>兌換</th>
                  <th>禮物名稱</th>
                  <th>兌換日期</th>
                  <th>兌換期限</th>
                </tr>
              </thead>
              <tbody>
                {redemptionRecords.map((record, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" defaultChecked={record.redeemed} />
                    </td>
                    <td>{record.giftName}</td>
                    <td>{new Date(record.redeemedDate).toLocaleDateString()}</td>
                    <td>{new Date(record.expirationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

