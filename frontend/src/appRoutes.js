import { Routes, Route } from 'react-router-dom';
import Products from './components/pages/products/products';
import App from './App';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}

export default AppRoutes;
