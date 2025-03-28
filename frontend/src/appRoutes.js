import { Routes, Route } from 'react-router-dom';
import Products from './components/pages/products/products';
import Confirm from './components/pages/confirm/confirm';
import Signup from './components/pages/signup/signup'
import ForgotPassword from './components/pages/forgotPassword/forgotPassword';
import NewPassword from './components/pages/newpassword/newpassword';
import AccountInfo from './components/pages/account-info/account-info';
import Purchase from './components/pages/purchase/purchase';
import Weeder from './components/pages/weeder/weeder'
import PreWeeder from './components/pages/pre-weeder/preWeeder';
import Product from './components/pages/single-product/product';
import AboutPage from './components/pages/aboutpage/aboutpage';
import CollaboratoriPage from './components/pages/collaboratoriPage/collaboratoripage';
import CartPage from './components/pages/cart/cart';
import BlogPage from './components/pages/blog/blogpage';
import Contatti from './components/pages/contatti/contatti';
import Sostenibilita from './components/pages/sostenibilità/sostenibilitapage';
import FootPrintPage from './components/pages/footprint/footprintPage';
import Partnership from './components/pages/partnership/partnership';
import CertificazioniPage from './components/pages/certificazioni/certificazionipage';
import PrivacyPolicyPage from './components/pages/privacypolicy/privacypolicy';
import TerminiPage from './components/pages/termini/termini';
import CookiePage from './components/pages/cookie/cookiepage';
import NotFoundPage from './components/pages/notfount/notFoundPage';
import App from './App';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe("pk_test_51Qqap7J0BPVuq51Y7Bp15pmKU75gD8W6jjBXlXZLWzSbRQjnUGOrDp0cbR6LVWmFDmYl88OiKuSYnbubSMbvmGBB00iqVsYVpf");
function AppRoutes() {
  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/confirm' element={<Confirm />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/newpassword' element={<NewPassword />} />
        <Route path='/account-info' element={<AccountInfo />} />
        <Route path='/purchase' element={<Purchase />} />
        <Route path='/preWeeder' element={<PreWeeder />} />
        <Route path='/become-weeder' element={<Weeder />} />
        <Route path='/products/:id' element={<Product/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/about/collaboratori' element={<CollaboratoriPage/>}/>
        <Route path='/about/blog' element={<BlogPage/>}/>
        <Route path='/about/contatti' element={<Contatti/>}/>
        <Route path='/about/sostenibilita' element={<Sostenibilita/>}/>
        <Route path='/about/footprint' element={<FootPrintPage/>}/>
        <Route path='/about/partnership' element={<Partnership/>}/>
        <Route path='/about/certificazioni' element={<CertificazioniPage/>}/>
        <Route path='/about/privacy' element={<PrivacyPolicyPage/>}/>
        <Route path='/about/termini' element={<TerminiPage/>}/>
        <Route path='/about/cookie' element={<CookiePage/>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </Elements>

  );
}

export default AppRoutes;
