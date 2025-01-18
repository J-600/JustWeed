import React from 'react';
import ReactDOM from 'react-dom/client'; // Usa createRoot da react-dom/client
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

// Usa createRoot per React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Misura le performance (opzionale)
reportWebVitals();
