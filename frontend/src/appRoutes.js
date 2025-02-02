import { Routes, Route } from 'react-router-dom';
import Products from './components/pages/products/products';
import Confirm from './components/pages/confirm/confirm';
import Signup from './components/pages/signup/signup'
import ForgotPassword from './components/pages/forgotPassword/forgotPassword';
import App from './App';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/products" element={<Products />} />
      <Route path="/signup" element={<Signup />}/>
      <Route path='/confirm' element={<Confirm/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
    </Routes>
  );
}

export default AppRoutes;
