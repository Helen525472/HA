import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './store.css';

function Store() {
  const [gifts, setGifts] = useState([]); // 儲存所有禮物的陣列
  const [userPoints, setUserPoints] = useState(0); // 使用者目前的點數
  const [selectedGift, setSelectedGift] = useState(null); // 被選中的禮物
  const navigate = useNavigate(); // 用於頁面導覽

  // 從後端取得禮物和使用者的點數
  useEffect(() => {
    const fetchData = async () => {
      try {
        const giftResponse = await fetch('http://localhost:3001/api/gifts/gift');
        const userResponse = await fetch('http://localhost:3001/api/user/exp', {
            method: 'GET',
            credentials: 'include', 
        });

        const giftsData = await giftResponse.json();
        const userData = await userResponse.json();

        setGifts(giftsData);
        setUserPoints(userData.Experience);
      } catch (error) {
        console.error('資料獲取錯誤:', error);
      }
    };
    fetchData();
  }, []);

  // 禮物兌換功能
  const handleRedeem = async (gift) => {
    const confirmRedeem = window.confirm(`你要兌換 ${gift.name} 嗎？`);
    if (confirmRedeem) {
      try {
        const response = await fetch('http://localhost:3001/api/gifts/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ giftId: gift._id }),
        });

        const result = await response.json();
        if (result.success) {
          alert('禮物兌換成功！');
          navigate('/store');
        } else {
          alert('兌換失敗！');
        }
      } catch (error) {
        console.error('兌換時發生錯誤:', error);
        alert('兌換過程中發生錯誤');
      }
    }
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
        <div className="store-container">
        <div className="home-icon" onClick={() => navigate('/dashboard')}>
            <img src="/icons/home.png" alt="Home" />
        </div>
        <h1>STORE</h1>

        <div className="gift-container">
            {gifts.map((gift) => (
            <div
                key={gift._id}
                className={`gift-box ${userPoints >= gift.expsRequired ? 'pink' : 'gray'}`}
                onMouseEnter={() => setSelectedGift(gift)}
            >
                
                <button
                className="redeem-button"
                disabled={userPoints < gift.expsRequired}
                onClick={() => handleRedeem(gift)}
                >
                {gift.expsRequired} EXP
                </button>
            </div>
            ))}
        </div>

        {selectedGift && (
            <div className="gift-info">
            <h2>{selectedGift.name}</h2>
            <p>{selectedGift.description}</p>
            <p>兌換地點: {selectedGift.location}</p>
            <p>兌換期限: {selectedGift.expiryDate}</p>
            </div>
        )}
        </div>
    </div>
  );
}

export default Store;
