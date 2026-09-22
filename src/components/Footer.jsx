import { Link } from 'react-router-dom';
import { BRAND } from '../config';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 32 }}>
        <div>
          <div className="brand" style={{ color: '#fff', marginBottom: 12 }}><span className="brand-dot" />{BRAND.name}</div>
          <p style={{ opacity: .7, fontSize: 13.5, maxWidth: 260, lineHeight: 1.6 }}>India's AI-first marketplace for pre-loved fashion. Buy, sell, swap and style your wardrobe, sustainably.</p>
        </div>
        <div><h4>Marketplace</h4><Link to="/browse">Browse all</Link><Link to="/sell">Sell an item</Link><Link to="/stylist">Outfit Stylist</Link><Link to="/impact">Sustainability</Link></div>
        <div><h4>Account</h4><Link to="/dashboard">Dashboard</Link><Link to="/dashboard?tab=orders">Orders</Link><Link to="/closet">My wardrobe</Link></div>
        <div><h4>Company</h4><a href="#">About</a><a href="#">Trust & safety</a><a href="#">Careers</a></div>
      </div>
      <div className="container" style={{ marginTop: 40, opacity: .5, fontSize: 12 }}>© 2026 {BRAND.name}. Prototype build for demo purposes.</div>
    </footer>
  );
}
