import { Routes, Route } from 'react-router-dom';
import Products from './components/pages/products/products';
import Confirm from './components/pages/confirm/confirm';
import Signup from './components/pages/signup/signup'
import ForgotPassword from './components/pages/forgotPassword/forgotPassword';
import NewPassword from './components/pages/newpassword/newpassword';
import AccountInfo from './components/pages/account-info/account-info';
import Purchase from './components/pages/purchase/purchase';
import Weeder from './components/pages/weeder/weeder'
import App from './App';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/products" element={<Products />} />
      <Route path="/signup" element={<Signup />}/>
      <Route path='/confirm' element={<Confirm/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      <Route path='/newpassword' element={<NewPassword/>}/>
      <Route path='/account-info' element={<AccountInfo/>}/>
      <Route path='/purchase' element={<Purchase/>}/>
      <Route path='/become-weeder' element={<Weeder/>}/>
    </Routes>
  );
}

export default AppRoutes;
