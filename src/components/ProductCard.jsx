import { Link } from 'react-router-dom';
import Garment from './Garment.jsx';
import Price from './Price.jsx';
import ConditionTag from './ConditionTag.jsx';
import Avatar from './Avatar.jsx';
import { Heart, Repeat } from './icons.jsx';
import { useStore, sellerOf } from '../store.jsx';

export default function ProductCard({ product: p }) {
  const { state, toggleWishlist } = useStore();
  const wished = state.wishlist.includes(p.id);
  const seller = sellerOf(p.sellerId);
  return (
    <Link to={`/product/${p.id}`} className="p-card fade-in">
      <div className="p-media">
        <div className="p-badges">
          {p.swap && <span className="pill" style={{ background: '#fff' }}><Repeat size={11} /> Swap</span>}
          {p.sold && <span className="pill" style={{ background: 'var(--ink)', color: '#fff' }}>Sold</span>}
        </div>
        <button
          className={`icon-btn p-wish ${wished ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }}
          aria-label="Wishlist"
        ><Heart size={16} fill={wished ? 'currentColor' : 'none'} /></button>
        <Garment type={p.type} color={p.color} pattern={p.pattern} fit={p.cut} hanger />
      </div>
      <div className="p-body">
        <span className="p-brand">{p.brand !== 'Other' ? p.brand : p.category}</span>
        <span className="p-title">{p.title}</span>
        <span className="p-meta"><ConditionTag condition={p.condition} /> · Size {p.size}</span>
        <Price price={p.price} mrp={p.mrp} />
        <div className="p-foot">
          <span className="seller-mini"><Avatar name={seller.name} hue={seller.hue} size={18} />{seller.name.split(' ')[0]}</span>
          <span className="rating">★ {seller.rating}</span>
        </div>
      </div>
    </Link>
  );
}
