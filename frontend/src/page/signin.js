import React, { useState, useEffect } from 'react';
import './signin.css';

function Signin({ onClose = () => {} }) {
  const [canSignIn, setCanSignIn] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkSignInStatus(); 
  
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkSignInStatus();
    }, 60000); // 每分鐘檢查一次
  
    return () => clearInterval(timer); // 清除定时器
  }, []);

  const checkSignInStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sign/status', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      const now = new Date();
      const hour = now.getHours();
      const isWithinSignInHours = hour < 9;
      setCanSignIn(data.canSignIn && isWithinSignInHours);
    } catch (error) {
      console.error('檢查簽到狀態錯誤:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sign', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('簽到成功！獲得3點經驗值。');
        setCanSignIn(false);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('簽到時出錯:', error);
      setMessage('簽到失敗，請稍後再試。');
    }
  };

  const closeSignin = () => {
    setIsOpen(false);
    onClose(); // 调用关闭函数
  };

  if (!isOpen) return null;

  const hour = currentTime.getHours();
  const isWithinSignInHours = hour < 9;
  const buttonText = isWithinSignInHours
    ? (canSignIn ? '簽到' : '已簽到')
    : '不可簽到';

  return (
    <div className="signin-container">
      <div className="signin-header">
        <h2>每日簽到</h2>
        <button className="close-button" onClick={closeSignin}>
          &times;
        </button>
      </div>
      <button
        className={`signin-button ${canSignIn ? 'active' : 'disabled'}`}
        onClick={handleSignIn}
        disabled={!canSignIn}
      >
        {buttonText}
      </button>
      {message && <p className="message">{message}</p>}
      <p>簽到時間：09:00以前</p>
    </div>
  );
}

export default Signin;


