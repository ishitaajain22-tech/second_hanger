import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import { useStore, sellerOf } from '../store.jsx';
import { inr } from '../lib/format';
import { FEES } from '../config';
import { Check, ShieldCheck, Truck } from '../components/icons.jsx';

export default function Checkout() {
  const { id } = useParams();
  const nav = useNavigate();
  const { productById, placeOrder, state } = useStore();
  const p = productById(id);
  const [addr, setAddr] = useState({ name: 'Aanya Sharma', line: '14, Koramangala 5th Block', city: 'Bengaluru', pin: '560095', phone: '98xxxxxx21' });
  const [pay, setPay] = useState('upi');
  const [placed, setPlaced] = useState(null);
  const offer = state.offers.find((o) => o.productId === id && o.status === 'accepted');
  if (!p) return null;
  const price = offer ? offer.agreed : p.price;
  const fee = Math.round(price * FEES.buyerProtectionPct);
  const total = price + FEES.shipping + fee;

  const confirm = () => setPlaced(placeOrder(p, { price, address: addr, pay }));

  if (placed) return (
    <div className="container" style={{ padding: '60px 0', maxWidth: 480, textAlign: 'center' }}>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Check size={30} color="var(--lime-ink)" /></div>
      <h2>Order placed!</h2>
      <p style={{ color: 'var(--ink-soft)', margin: '10px 0 24px' }}>Order {placed.id} confirmed. The seller has 48 hours to ship. Track it from your dashboard.</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => nav('/dashboard?tab=orders')}>Track order</button>
        <button className="btn btn-outline" onClick={() => nav('/browse')}>Keep browsing</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60, maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Checkout</h1>
      <div className="card" style={{ padding: 16, display: 'flex', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, background: '#F4F0E6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Garment type={p.type} color={p.color} pattern={p.pattern} /></div>
        <div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Size {p.size} · {p.condition}</div>{offer && <div style={{ fontSize: 12, color: 'var(--sage-dk)', fontWeight: 700 }}>Accepted offer price applied</div>}</div>
      </div>

      <h4 style={{ fontSize: 15, marginBottom: 10 }}>Delivery address</h4>
      <div className="field"><label>Name</label><input value={addr.name} onChange={(e) => setAddr((a) => ({ ...a, name: e.target.value }))} /></div>
      <div className="field"><label>Address</label><input value={addr.line} onChange={(e) => setAddr((a) => ({ ...a, line: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div className="field"><label>City</label><input value={addr.city} onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))} /></div>
        <div className="field"><label>PIN</label><input value={addr.pin} onChange={(e) => setAddr((a) => ({ ...a, pin: e.target.value }))} /></div>
      </div>

      <h4 style={{ fontSize: 15, margin: '18px 0 10px' }}>Payment</h4>
      <div className="chip-row" style={{ marginBottom: 20 }}>
        {[['upi', 'UPI'], ['card', 'Card'], ['cod', 'Cash on delivery']].map(([k, l]) => <button key={k} className={`chip ${pay === k ? 'active' : ''}`} onClick={() => setPay(k)}>{l}</button>)}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <Row l="Item price" v={inr(price)} /><Row l="Shipping" v={inr(FEES.shipping)} /><Row l="Buyer protection fee" v={inr(fee)} />
        <div className="hr" style={{ margin: '10px 0' }} /><Row l={<b>Total</b>} v={<b>{inr(total)}</b>} />
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-soft)', marginBottom: 20 }}>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><ShieldCheck size={13} /> Buyer protection: full refund if item doesn't match</span>
      </div>
      <button className="btn btn-primary btn-lg btn-block" onClick={confirm}>Pay {inr(total)}</button>
    </div>
  );
}
function Row({ l, v }) { return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '4px 0' }}><span>{l}</span><span>{v}</span></div>; }
