import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18's createRoot
import './index.css';
import AppRoutes from './appRoutes';  // Import AppRoutes
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>  {/* Only one BrowserRouter should be here */}
    <AppRoutes />   {/* Use AppRoutes to handle routing */}
  </BrowserRouter>
);

reportWebVitals();
