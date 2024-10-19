import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './choose.css';

function Choose() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchCategories();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/food-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSpin = () => {
    if (!selectedCategory) return;
    
    setIsSpinning(true);
    setResult(null);

    // 模拟转盘旋转
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * selectedCategory.items.length);
      setResult(selectedCategory.items[randomIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  const handleReturnToFoodPlaza = () => {
    navigate('/food');
  };

  return (
    <div className="food-roulette-container">
      <div className="top-bar">
        <button onClick={handleReturnToFoodPlaza} className="return-button">
          返回美食廣場
        </button>
        {user && (
          <div className="user-info">
            <span>暱稱: {user.nickname}</span>
            <span>員工編號: {user.employeeId}</span>
          </div>
        )}
      </div>

      <div className="roulette-area">
        <h2>美食轉盤</h2>
        <div className="category-buttons">
          {categories.map(category => (
            <button 
              key={category.id} 
              onClick={() => handleCategorySelect(category)}
              className={selectedCategory === category ? 'selected' : ''}
            >
              {category.name}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <div className="roulette-wheel">
            <button onClick={handleSpin} disabled={isSpinning}>
              {isSpinning ? '旋轉中...' : '開始旋轉'}
            </button>
          </div>
        )}
        {result && (
          <div className="result">
            <h3>結果: {result}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Choose;