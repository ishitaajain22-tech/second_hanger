import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import Price from '../components/Price.jsx';
import ConditionTag from '../components/ConditionTag.jsx';
import Avatar from '../components/Avatar.jsx';
import TrustBadge from '../components/TrustBadge.jsx';
import FitBadge from '../components/FitBadge.jsx';
import Modal from '../components/Modal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Heart, Repeat, ShieldCheck, Truck, RotateCcw, MessageCircle, ChevronRight, Send, Info } from '../components/icons.jsx';
import { useStore, sellerOf } from '../store.jsx';
import { fitMatch } from '../lib/fit';
import { inr, timeAgo } from '../lib/format';
import { completeTheLook } from '../lib/stylist';
import { conditionMeta } from '../config';

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { products, productById, state, toggleWishlist, makeOffer, proposeSwap, ensureThread, sendMessage } = useStore();
  const p = productById(id);
  const [offerOpen, setOfferOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  if (!p) return <div className="container" style={{ padding: 60 }}>Item not found. <Link to="/browse">Back to browse</Link></div>;
  const seller = sellerOf(p.sellerId);
  const wished = state.wishlist.includes(p.id);
  const fit = fitMatch(p, state.measurements);
  const suggestions = useMemo(() => completeTheLook(p, products, state.measurements), [p, products, state.measurements]);
  const cond = conditionMeta(p.condition);
  const myOffer = state.offers.find((o) => o.productId === p.id && o.dir === 'out' && ['pending', 'countered'].includes(o.status));
  const swapables = state.wardrobe;

  const startChat = () => { const tid = ensureThread({ type: 'seller', id: p.sellerId }, p.id); nav(`/dashboard?tab=messages&thread=${tid}`); };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 16 }}>
        <Link to="/browse">Browse</Link> <ChevronRight size={11} style={{ verticalAlign: -1 }} /> <Link to={`/browse?cat=${p.category}`}>{p.category}</Link> <ChevronRight size={11} style={{ verticalAlign: -1 }} /> {p.title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <div className="card" style={{ aspectRatio: '1/1.05', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#F4F0E6,#ECE6D6)', padding: 30, position: 'relative' }}>
            {p.sold && <span className="pill" style={{ position: 'absolute', top: 16, left: 16, background: 'var(--ink)', color: '#fff' }}>Sold</span>}
            <Garment type={p.type} color={p.color} pattern={p.pattern} fit={p.cut} hanger style={{ width: '80%', height: '80%' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {[0, 1, 2].map((i) => <div key={i} className="card" style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F0E6', opacity: i === 0 ? 1 : .55 }}><Garment type={p.type} color={p.color} pattern={p.pattern} style={{ width: '70%' }} /></div>)}
          </div>
        </div>

        <div>
          <span className="p-brand" style={{ fontSize: 12.5 }}>{p.brand !== 'Other' ? p.brand : p.category}</span>
          <h1 style={{ fontSize: 30, margin: '4px 0 10px' }}>{p.title}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <ConditionTag condition={p.condition} /><span className="pill">Size {p.size}</span>{p.swap && <span className="pill"><Repeat size={12} /> Swap OK</span>}
            {fit && <FitBadge product={p} measurements={state.measurements} />}
          </div>
          <Price price={p.price} mrp={p.mrp} size="lg" />
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '4px 0 22px' }}>{p.views} views · {p.likes} likes · Listed {timeAgo(p.listedAt)}</p>

          {!p.sold ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => nav(`/checkout/${p.id}`)}>Buy now</button>
              <button className="btn btn-outline btn-lg" onClick={() => setOfferOpen(true)} disabled={p.sellerId === 'me'}>{myOffer ? 'View your offer' : 'Make an offer'}</button>
              {p.swap && <button className="btn btn-outline btn-lg" onClick={() => setSwapOpen(true)} disabled={p.sellerId === 'me'}><Repeat size={16} /> Propose swap</button>}
              <button className={`icon-btn ${wished ? 'active' : ''}`} style={{ width: 48, height: 48 }} onClick={() => toggleWishlist(p.id)}><Heart size={18} fill={wished ? 'currentColor' : 'none'} /></button>
            </div>
          ) : <div className="pill" style={{ background: '#F1ECE0' }}>This item has sold</div>}

          {myOffer && (
            <div className="card" style={{ padding: 14, marginTop: 14, fontSize: 13.5 }}>
              Your offer: <b>{inr(myOffer.amount)}</b> · Status: <b style={{ textTransform: 'capitalize' }}>{myOffer.status}</b>
              {myOffer.status === 'countered' && <span> · Seller countered at <b>{inr(myOffer.counter)}</b></span>}
            </div>
          )}

          <div className="hr" style={{ margin: '24px 0' }} />
          <Link to={`/seller/${seller.id}`} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={seller.name} hue={seller.hue} size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{seller.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{seller.city} · ★ {seller.rating} ({seller.reviews})</div>
            </div>
            <TrustBadge seller={seller} size="sm" />
            <ChevronRight size={16} />
          </Link>
          <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={startChat}><MessageCircle size={15} /> Message seller</button>

          <div className="hr" style={{ margin: '22px 0' }} />
          <h4 style={{ fontSize: 17, marginBottom: 10 }}>Description</h4>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{p.description}</p>

          <h4 style={{ fontSize: 17, margin: '22px 0 10px' }}>Measurements</h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(p.measures).map(([k, v]) => <div key={k} className="card" style={{ padding: '8px 14px', fontSize: 13 }}><b style={{ textTransform: 'capitalize' }}>{k}</b>: {v} cm</div>)}
          </div>

          {fit && (
            <div className="card" style={{ padding: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 700, fontSize: 14, marginBottom: 8 }}><ShieldCheck size={15} /> Smart Fit Match — {fit.label} ({fit.score}%)</div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 10 }}>{fit.tip}</p>
              {fit.rows.map((r) => (
                <div key={r.name} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}><span>{r.name}</span><span style={{ color: 'var(--ink-soft)' }}>{r.note}</span></div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${r.score}%`, background: r.score > 80 ? 'var(--sage)' : r.score > 60 ? 'var(--gold)' : 'var(--err)' }} /></div>
                </div>
              ))}
              <Link to="/dashboard?tab=measurements" style={{ fontSize: 12.5, color: 'var(--sage-dk)', fontWeight: 700 }}>Update your measurements →</Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 20, fontSize: 12.5, color: 'var(--ink-soft)' }}>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><Truck size={14} /> Ships in {cond.short === 'NWT' ? '1-2' : '2-4'} days</span>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><RotateCcw size={14} /> 24h return if not as described</span>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><ShieldCheck size={14} /> Buyer protection included</span>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="section">
          <div className="section-head"><div><div className="eyebrow">AI Outfit Stylist</div><h2 style={{ fontSize: 26 }}>Complete the look</h2></div></div>
          <div className="grid-products">{suggestions.map((s) => <ProductCard key={s.id} product={s} />)}</div>
        </div>
      )}

      {offerOpen && <OfferModal product={p} onClose={() => setOfferOpen(false)} onSend={(amt, note) => { makeOffer(p, amt, note); setOfferOpen(false); }} />}
      {swapOpen && <SwapModal product={p} wardrobe={swapables} onClose={() => setSwapOpen(false)} onSend={(item, topUp, note) => { proposeSwap(p, item, swapValue(item), topUp, note); setSwapOpen(false); }} />}
    </div>
  );
}

function swapValue(item) { return 400 + (item.name.length * 23) % 900; }

function OfferModal({ product, onClose, onSend }) {
  const [amt, setAmt] = useState(Math.round(product.price * 0.85 / 10) * 10);
  const [note, setNote] = useState('');
  return (
    <Modal title="Make an offer" onClose={onClose}>
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 16 }}>Listed at {inr(product.price)}. Sellers usually accept offers within 15% of asking.</p>
        <div className="field"><label>Your offer (₹)</label><input type="number" value={amt} onChange={(e) => setAmt(+e.target.value)} /></div>
        <div className="field"><label>Note (optional)</label><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Would you take a little less?" /></div>
        <button className="btn btn-primary btn-block" onClick={() => onSend(amt, note)}><Send size={15} /> Send offer</button>
      </div>
    </Modal>
  );
}

function SwapModal({ product, wardrobe, onClose, onSend }) {
  const [sel, setSel] = useState(wardrobe[0]?.id);
  const [note, setNote] = useState('');
  const item = wardrobe.find((w) => w.id === sel);
  const value = item ? swapValue(item) : 0;
  const diff = product.price - value;
  return (
    <Modal title="Propose a swap" onClose={onClose}>
      <div style={{ padding: 20 }}>
        {wardrobe.length === 0 ? <p>Add items to your wardrobe first from the Closet page.</p> : (<>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 12 }}>Pick something from your closet to offer in exchange.</p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
            {wardrobe.map((w) => (
              <button key={w.id} onClick={() => setSel(w.id)} className="card" style={{ padding: 8, minWidth: 84, border: sel === w.id ? '2px solid var(--ink)' : '1px solid var(--line)', background: '#F4F0E6' }}>
                <Garment type={w.type} color={w.color} pattern={w.pattern} style={{ width: 60, height: 60 }} />
                <div style={{ fontSize: 10.5, marginTop: 3, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
              </button>
            ))}
          </div>
          {item && <div className="card" style={{ padding: 12, fontSize: 13, marginBottom: 12 }}>Estimated value of "{item.name}": <b>{inr(value)}</b>. {diff > 100 ? `You may need to add ~${inr(diff)} to balance value.` : 'Values are close, likely a fair swap.'}</div>}
          <div className="field"><label>Note</label><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Happy to add a little cash if needed!" /></div>
          <button className="btn btn-primary btn-block" onClick={() => onSend(item, diff > 100 ? diff : 0, note)}><Repeat size={15} /> Propose swap</button>
        </>)}
      </div>
    </Modal>
  );
}
