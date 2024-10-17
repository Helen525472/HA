import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import playerImages from './playerImage';  // 导入映射表
import './player.css';

function Player() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const navigate = useNavigate();
  const handlePlayerClick = (playerId) => {
    setSelectedPlayer(playerId);
  };

  const handleSaveClick = async () => {
    if (selectedPlayer) {
      try {
        const response = await fetch('http://localhost:3001/api/picture/save-picture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({playerId: selectedPlayer }),
          credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
          navigate('/Nickname');;
        } else {
          alert('保存失敗');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('保存玩家信息時錯誤');
      }
    }
  };

  return (
    <div>
      <h1>Select Your Player</h1>
      <div id="players">
        {Object.keys(playerImages).map((id) => (
          <div
            key={id}
            className={`player-icon ${selectedPlayer === id ? 'selected' : ''}`}
            onClick={() => handlePlayerClick(id)}
          >
            <img src={playerImages[id]} alt={`Player ${id}`} />
          </div>
        ))}
      </div>
      <button
        id="save-btn"
        className={selectedPlayer ? 'enabled' : ''}
        onClick={handleSaveClick}
        disabled={!selectedPlayer}
      >
        Save
      </button>
    </div>
  );
}

export default Player;