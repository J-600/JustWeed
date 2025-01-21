import { Routes, Route } from 'react-router-dom';
import Products from './components/pages/products/products';
import Signup from './components/pages/signup/signup'
import App from './App';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/products" element={<Products />} />
      <Route path="/signup" element={<Signup />}/>
    </Routes>
  );
}

export default AppRoutes;
