import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function home() {
  return (
    <div
      style={{
        backgroundImage: 'url("/picture/home.png")',
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
      <div className="game-container">
        <h1>Office Escape</h1>
        <Link to="/login">
        <button className="play-button">Play</button>
        </Link>
      </div>
    </div>
  );
}

export default home;