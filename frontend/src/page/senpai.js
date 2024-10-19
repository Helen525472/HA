import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './senpai.css';

function Senpai() {
  const [user, setUser] = useState(null);
  const [senpai, setSenpaiInfo] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [showDepartments, setShowDepartments] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const departmentMapping = {
    '市場部': 'Marketing',
    '行銷部': 'Sales',
    '財務部': 'Finance',
    '法務部': 'Legal',
    '技術部': 'Technical',
    '公關部': 'Public_Relations',
    '人力資源部': 'Human_Resources',
    '採購部': 'Procurement',
    '營運部': 'Operations',
    '研發部': 'R&D'
  };
  
  const departments = Object.keys(departmentMapping);

  useEffect(() => {
    fetchUserInfo();
    if (currentDepartment) {
      fetchSenpaiInfo(currentDepartment);
    }
  }, [currentDepartment]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Failed to fetch user info:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchSenpaiInfo = async (department) => {
    try {
      const englishDepartment = departmentMapping[department];
      //console.log(`Fetching info for department: ${englishDepartment}`);
      
      const response = await fetch(`http://localhost:3001/api/senpai/${englishDepartment}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Response data:', data);
        setSenpaiInfo(data);
        setCurrentSection('senpai');
      } else {
        console.error('Failed to fetch data:', response.status);
        setErrorMessage('後端沒有返回正確的數據');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('無法連結到服務器');
    }
  };

  const handleDepartmentSelect = (department) => {
    setCurrentDepartment(department);
    fetchSenpaiInfo(department);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="senpai-container">
      <div className="top-bar">
        {user && (
          <div className="user-info">
            <span>暱稱: {user.nickname}</span>
            <span>員工編號: {user.employeeId}</span>
          </div>
        )}
      </div>
      
      <div  className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={() => navigate('/village')}>返回新手村入口</button>
        <button onClick={() => {setCurrentSection('home'); setCurrentDepartment(null);}}>前人資訊首頁</button>
        <button onClick={() => setShowDepartments(!showDepartments)}>部門</button>
        {showDepartments && (
          <div className="department-list">
            {departments.map((dept) => (
              <button key={dept} onClick={() => handleDepartmentSelect(dept)}>
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="main-content">
        <button onClick={toggleSidebar} className="sidebar-toggle">
          {isSidebarOpen ? '←' : '☰'}
        </button>
        <h2>{currentDepartment || '首頁'}</h2>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        
        {currentSection === 'home' ? (
          <div className="home-content">
            <img src="/path/to/your/image.jpg" alt="首頁圖片" />
            <p>歡迎來到前人資訊系統</p>
          </div>
        ) : (
        <div className="senpai-info-list">
          {senpai.map((senpai) => (
            <div key={senpai.id} className="senpai-info-item">
              <h3>{senpai.First_Name} {senpai.Last_Name}</h3>
              <p>職務: {senpai.Position}</p>
              <p>入職時間: {new Date(senpai.Hire_Date).toLocaleDateString()}</p>
              <p>聯絡方式: {senpai.Email}</p>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Senpai;