import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Toasts from './components/Toasts.jsx';
import Landing from './pages/Landing.jsx';
import Browse from './pages/Browse.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Sell from './pages/Sell.jsx';
import Checkout from './pages/Checkout.jsx';
import SellerProfile from './pages/SellerProfile.jsx';
import Closet from './pages/Closet.jsx';
import ClosetItem from './pages/ClosetItem.jsx';
import Stylist from './pages/Stylist.jsx';
import Impact from './pages/Impact.jsx';
import Dashboard from './pages/Dashboard.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div>
      <ScrollTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/closet/:id" element={<ClosetItem />} />
        <Route path="/stylist" element={<Stylist />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Footer />
      <Toasts />
    </div>
  );
}
