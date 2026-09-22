import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Heart, ShoppingBag, Home, Compass, Shirt, Wand2, User } from './icons.jsx';
import Avatar from './Avatar.jsx';
import { useStore } from '../store.jsx';
import { BRAND } from '../config';

export default function Nav() {
  const { me, state, unread } = useStore();
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const submit = (e) => { e.preventDefault(); nav(`/browse?q=${encodeURIComponent(q)}`); };
  const wishCount = state.wishlist.length;

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand"><span className="brand-dot" />{BRAND.name}</Link>
          <div className="nav-links">
            <NavLink to="/browse" className={({ isActive }) => (isActive ? 'active' : '')}>Browse</NavLink>
            <NavLink to="/sell" className={({ isActive }) => (isActive ? 'active' : '')}>Sell</NavLink>
            <NavLink to="/closet" className={({ isActive }) => (isActive ? 'active' : '')}>Wardrobe</NavLink>
            <NavLink to="/stylist" className={({ isActive }) => (isActive ? 'active' : '')}>Stylist</NavLink>
            <NavLink to="/impact" className={({ isActive }) => (isActive ? 'active' : '')}>Impact</NavLink>
          </div>
          <form className="nav-search" onSubmit={submit}>
            <Search size={15} />
            <input placeholder="Search “black jeans under ₹1000”" value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <div className="nav-actions">
            <Link to="/dashboard?tab=wishlist" className="icon-btn" style={{ position: 'relative' }}>
              <Heart size={16} />{wishCount > 0 && <span className="badge-dot">{wishCount}</span>}
            </Link>
            <Link to="/dashboard?tab=messages" className="icon-btn" style={{ position: 'relative' }}>
              <ShoppingBag size={16} />{unread > 0 && <span className="badge-dot">{unread}</span>}
            </Link>
            <Link to="/dashboard"><Avatar name={me.name} hue={me.hue} /></Link>
          </div>
        </div>
      </nav>
      <div className="mnav">
        <div className="mnav-inner">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}><Home size={19} />Home</NavLink>
          <NavLink to="/browse" className={({ isActive }) => (isActive ? 'active' : '')}><Compass size={19} />Browse</NavLink>
          <NavLink to="/closet" className={({ isActive }) => (isActive ? 'active' : '')}><Shirt size={19} />Closet</NavLink>
          <NavLink to="/stylist" className={({ isActive }) => (isActive ? 'active' : '')}><Wand2 size={19} />Stylist</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}><User size={19} />You</NavLink>
        </div>
      </div>
    </>
  );
}
