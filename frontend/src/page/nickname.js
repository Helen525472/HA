import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './nickname.css';

function Nickname() {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert('請輸入有效的暱稱');
      return;
    }

    try {
      // 檢查有沒有重複暱稱
      const response = await fetch('http://localhost:3001/api/nick/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.exists) {
        alert('名稱不合，請重填');
      } else {
        // 沒重複就存入資料庫
        await fetch('http://localhost:3001/api/nick/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nickname }),
          credentials: 'include',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('存取資料庫時發生錯誤');
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/picture/login.png")',
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
        <div className="nickname-container">
        <h1>NICKNAME</h1>
        <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
        />
        <button onClick={handleSubmit}>ENTER</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    </div>
  );
}

export default Nickname;