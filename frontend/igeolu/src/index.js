// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'
=======
import './index.css';
>>>>>>> feature/S12P11D205-174-chatting

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <BrowserRouter>
    <App />
    </BrowserRouter>
=======
    <Router>
      <App />
    </Router>
>>>>>>> feature/S12P11D205-174-chatting
  </React.StrictMode>
);

export const isProduction = process.env.NODE_ENV === 'production';
