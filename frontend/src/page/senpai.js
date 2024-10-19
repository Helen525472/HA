import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './senpai.css';

function Senpai() {
  const [user] = useState(null);
  const [senpai, setSenpaiInfo] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [showDepartments, setShowDepartments] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // 使用 useMemo 緩存 departmentMapping
  const departmentMapping = useMemo(() => ({
    '市場部': 'Marketing',
    '行銷部': 'Sales',
    '財務部': 'Finance',
    '法務部': 'Legal',
    '技術部': 'Technical',
    '公關部': 'Public_Relations',
    '人力資源部': 'Human_Resources',
    '採購部': 'Procurement',
    '營運部': 'Operations',
    '研發部': 'R&D',
  }), []);

  const departments = Object.keys(departmentMapping);



  const fetchSenpaiInfo = useCallback(
    async (department) => {
      try {
        const englishDepartment = departmentMapping[department];
        const response = await fetch(`http://localhost:3001/api/senpai/${englishDepartment}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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
    },
    [departmentMapping]
  );

  useEffect(() => {

    if (currentDepartment) {
      fetchSenpaiInfo(currentDepartment);
    }
  }, [ fetchSenpaiInfo, currentDepartment]);

  const handleDepartmentSelect = (department) => {
    setCurrentDepartment(department);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="senpai-container"
    style={{
      backgroundImage: 'url("/picture/senpai.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div className="top-bar">
        {user && (
          <div className="user-info">
            <span>暱稱: {user.nickname}</span>
            <span>員工編號: {user.employeeId}</span>
          </div>
        )}
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={() => navigate('/village')}>返回新手村入口</button>
        <button onClick={() => { setCurrentSection('home'); setCurrentDepartment(null); }}>前輩資訊首頁</button>
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
          <h2>{currentDepartment || '歡迎來到前輩資訊系統'}</h2>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {currentSection === 'home' ? (
          
              <div className="home-content">
                <p>『剛來到公司，誰都不認識!?怎麼辦!遇到問題不知道問誰!』</p>
                <p>『昨天吃飯時遇到一位前輩，他說我有問題都能請教他，可是我忘記留聯繫方式!?』</p>
                <br/>
                <p>對於剛進公司的你，肯定會因為初來乍到，沒有熟悉的人而感到害怕吧</p>
                <p>別擔心!!!你可以依據自己的所屬部門找到部門前輩</p>
                <p>或是根據姓名，找到在公司任何角落偶遇但沒留下聯絡資訊的前輩</p>
                <p>透過我們整理的聯絡資訊找到他/她啦</p>
                <br/>
                <p>(p.s. 別擔心公司裡的人都很友善，儘管大膽發問喔)</p>

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
