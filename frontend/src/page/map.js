import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './map.css';

function FoodMap() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
    fetchUserInfo();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/restaurants/${selectedRestaurant.id}/comments`, {
        content: newComment,
        rating: newRating,
        department: user.department
      });
      fetchRestaurants();
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentEdit = async (commentId, newContent) => {
    try {
      await axios.put(`/api/comments/${commentId}`, { content: newContent });
      fetchRestaurants();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

     // 添加返回美食广场的函数
  const handleReturnToFoodPlaza = () => {
    navigate('/food');  // 假设美食广场的路由是 '/food'
  };

  return (
    <div className="food-map-container">
      <div className="top-bar">
        <button onClick={handleReturnToFoodPlaza} className="return-button">
          返回美食廣場
        </button>
      </div>

      <div className="content-area">
        <div className="restaurant-list">
          {restaurants.map((restaurant) => (
            <button key={restaurant.id} onClick={() => handleRestaurantClick(restaurant)}>
              {restaurant.name}
            </button>
          ))}
        </div>

        {selectedRestaurant && (
          <div className="restaurant-info">
            <h2>{selectedRestaurant.name}</h2>
            <p>地址: {selectedRestaurant.address}</p>
            <p>營業時間: {selectedRestaurant.openingHours}</p>
            <p>評分: {selectedRestaurant.averageRating}</p>

            <h3>評價</h3>
            {selectedRestaurant.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                <p>評分: {comment.rating}</p>
                <p>部門: {comment.department}</p>
                <p>發布日期: {new Date(comment.createdAt).toLocaleDateString()}</p>
                {user && user.id === comment.userId && (
                  <button
                    onClick={() => {
                      const updatedContent = prompt('編輯評論:', comment.content);
                      if (updatedContent !== null) {
                        handleCommentEdit(comment.id, updatedContent);
                      }
                    }}
                  >
                    編輯
                  </button>
                )}
              </div>
            ))}

            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="寫下您的評價"
              />
              <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button type="submit">提交評價</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodMap;