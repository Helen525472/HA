import React from 'react';
import { useNavigate } from 'react-router-dom';
import './village.css';
//新手村頁面
function Village() {
    const navigate = useNavigate();

    // 导航到留言板页面
    const handleBoardClick = () => {
        navigate('/Tsmcard'); //新手村留言板
    };

    // 导航到前人資訊页面
    const handleInfoClick = () => {
        navigate('/Senpai'); //新手村前人資訊
    };

    // 打开公司内部地图
    const handleMapClick = () => {
        // 如果使用外部链接：
        window.open('https://example.com/company-map', '_blank');
        
        // 如果使用本地文件：
        // window.open('/files/company-map.pdf', '_blank');
    };

    return (
        <div
          className="village-container"
          style={{
            backgroundImage: 'url("/picture/village.png")',
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
            <div className="home-icon" onClick={() => navigate('/dashboard')}>
                <img src="/icon/home_white.png" alt="Home" />
            </div>
            <h1>Welcome to 新手村</h1>
            <button className="village-button" onClick={handleBoardClick}>
                台積論壇
            </button>
            <button className="village-button" onClick={handleInfoClick}>
                前人資訊
            </button>
            <button className="village-button" onClick={handleMapClick}>
                公司地圖
            </button>
        </div>
    );
}

export default Village;
