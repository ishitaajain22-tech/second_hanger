import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Avatar from '../components/Avatar.jsx';
import { useStore, sellerOf } from '../store.jsx';
import { trustScore } from '../lib/trust';
import { reviewsFor } from '../data/sellers';
import { ShieldCheck, Star, MapPin, Clock } from '../components/icons.jsx';

export default function SellerProfile() {
  const { id } = useParams();
  const { products } = useStore();
  const seller = sellerOf(id);
  if (!seller) return null;
  const t = trustScore(seller);
  const items = products.filter((p) => p.sellerId === id && !p.sold);
  const reviews = reviewsFor(seller);

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 40, marginBottom: 40 }}>
        <div className="card" style={{ padding: 26, textAlign: 'center' }}>
          <Avatar name={seller.name} hue={seller.hue} size={84} className="fade-in" />
          <h2 style={{ margin: '14px 0 2px' }}>{seller.name}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{seller.handle}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '14px 0', fontSize: 12.5, color: 'var(--ink-soft)' }}>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><MapPin size={13} /> {seller.city}</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><Clock size={13} /> Joined {seller.joined}</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 16 }}>{seller.bio}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>{t.badges.map((b) => <span key={b} className="pill">{b}</span>)}</div>
        </div>

        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${t.color}18`, color: t.color, fontWeight: 800 }}><ShieldCheck size={22} /></div>
              <div><div style={{ fontWeight: 800, fontSize: 20 }}>{t.total}/100 — {t.label}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Seller Trust Score</div></div>
            </div>
            {t.parts.map((pt) => (
              <div key={pt.key} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}><span>{pt.key}</span><span>{pt.val}/{pt.max}</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(pt.val / pt.max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            <Stat v={seller.sales} l="Items sold" /><Stat v={`★ ${seller.rating}`} l={`${seller.reviews} reviews`} /><Stat v={`${seller.respHrs <= 1 ? '<1h' : seller.respHrs + 'h'}`} l="Avg response" />
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: 16 }}>Reviews</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 44 }}>
        {reviews.map((r) => (
          <div key={r.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><b style={{ fontSize: 13.5 }}>{r.name}</b><span style={{ color: 'var(--gold)' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span></div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{r.text}</p>
            <p style={{ fontSize: 11, color: '#A39E8C', marginTop: 6 }}>{r.when}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 16 }}>{seller.name.split(' ')[0]}'s closet ({items.length})</h3>
      {items.length ? <div className="grid-products">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <p style={{ color: 'var(--ink-soft)' }}>No active listings right now.</p>}
    </div>
  );
}
function Stat({ v, l }) { return <div className="card" style={{ padding: 16, textAlign: 'center' }}><div style={{ fontFamily: 'var(--serif)', fontSize: 24 }}>{v}</div><div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{l}</div></div>; }
