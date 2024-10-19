import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [userId, setUserId] = useState(''); 
    const [password, setPassword] = useState('');  
    const [errorMessage, setErrorMessage] = useState(''); 
    const navigate = useNavigate();  
  
    const handleSubmit = async (e) => {
      e.preventDefault();  
      
      console.log('Sending userId:', userId);
      console.log('Sending password:', password);

      try {
        // 發送POST請求到後端API
        const response = await fetch('http://localhost:3001/api/user/check-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, password }),  // 將用戶ID和密碼做為請求
          credentials: 'include' //一定要有這行
        });
        const data = await response.json();
        
        if (response.ok) {
            console.log('Response data:', data);
          } else {
            console.error('Failed to fetch data:', response.status);
            setErrorMessage('後端沒有返回正確的數據');
          }
  
        if (data.exists) {
          const firstLoginResponse = await fetch('http://localhost:3001/api/auth/check-first-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
            credentials: 'include'
          });
    
          const firstLoginData = await firstLoginResponse.json();
    
          if (firstLoginData.isFirstLogin) {
            navigate('/Player');
          } else {
            navigate('/Dashboard');
          }
        } else {
          alert('ID或密碼錯誤');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('無法連結');
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
        <div className="login-container">
        <h1>LOG IN</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            id="user-id"
            name="user-id"
            placeholder="ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            />
            <br />
            <input
            type="password"
            id="password"
            name="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <div className="hint-text">預設密碼為出生日期(如20040101)</div>
            <br />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button type="submit" className="login-button">
            LOG IN
            </button>
        </form>
        </div>
    </div>
  );
}

export default Login;