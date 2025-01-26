// src/pages/Home/Home.jsx
import React, { useState } from 'react';
import './Home.css';  // 스타일 파일도 함께 생성해주세요.

const Home = () => {
  const [count, setCount] = useState(0); // 숫자 상태

  const handleIncrement = () => {
    setCount(count + 1);  // 현재 count 값에 1을 더합니다.
  };

  return (
    <div className="home-container">
      <h1>Current Count: {count}</h1>
      <button onClick={handleIncrement}>Increase Count</button>
    </div>
  );
};

export default Home;
