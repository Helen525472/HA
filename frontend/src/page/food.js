import React, { useState, useEffect } from 'react';
import './food.css';

function FoodCourt() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeCategory, setActiveCategory] = useState('所有種類');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['所有種類', '台式', '日式', '義式', '異國', '韓式', '美式'];

  // 從資料庫獲取餐廳資料
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/foods/all');
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data); // 預設顯示所有餐廳
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  // 根據所選類別過濾餐廳
  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === '所有種類') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        (restaurant) => restaurant.style === category
      );
      setFilteredRestaurants(filtered);
    }
  };

  // 隨機選擇餐廳並顯示彈窗
  const selectRandomRestaurant = () => {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    setSelectedRestaurant(restaurants[randomIndex]);
    setShowModal(true);
  };

  // 關閉彈窗
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className="foodcourt-container"
      style={{
        backgroundImage: 'url("/picture/foodcourt.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="home-icon" onClick={() => window.location.href = '/dashboard'}>
        <img src="/icon/home.png" alt="Home" />
      </div>

      <h1>FOOD COURT</h1>
      <button onClick={selectRandomRestaurant}>不知道吃什麼就點我吧 !</button>

      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => filterByCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="restaurant-list">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.style}</p>
            <p>{restaurant.address}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>不然. . .今天就吃 {selectedRestaurant?.name} 吧 !</h2>
            <p>類型: {selectedRestaurant?.style}</p>
            <p>地址: {selectedRestaurant?.address}</p>
            <button onClick={closeModal}>關閉</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodCourt;
