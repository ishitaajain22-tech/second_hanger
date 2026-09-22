import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import Avatar from '../components/Avatar.jsx';
import Price from '../components/Price.jsx';
import ConditionTag from '../components/ConditionTag.jsx';
import { useStore, sellerOf, partyOf } from '../store.jsx';
import { inr, timeAgo, fmtDate } from '../lib/format';
import { earningsSummary, netOf } from '../lib/impact';
import { Package, Wallet, Heart, MessageCircle, Settings, Edit3, Trash2, Send, Check, X, Truck, Repeat, ShieldCheck, ChevronRight, LayoutGrid, User } from '../components/icons.jsx';
import { FEES } from '../config';

const TABS = [
  ['listings', 'Listings', LayoutGrid], ['orders', 'Orders', Package], ['offers', 'Offers & Swaps', Repeat], ['wishlist', 'Wishlist', Heart],
  ['earnings', 'Earnings', Wallet], ['messages', 'Messages', MessageCircle], ['measurements', 'Measurements', User],
];

export default function Dashboard() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') || 'listings';
  const setTab = (t) => setSp({ tab: t });
  const { me, state } = useStore();

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Avatar name={me.name} hue={me.hue} size={62} />
        <div><h1 style={{ fontSize: 26 }}>{me.name}</h1><p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{me.handle} · {me.city} · ★ {me.rating} ({me.reviews})</p></div>
      </div>
      <div className="tabs" style={{ marginBottom: 26 }}>
        {TABS.map(([k, l, Icon]) => (
          <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Icon size={14} /> {l}{k === 'messages' && state.threads.some((t) => t.unread) ? <span className="badge-dot" style={{ position: 'static' }}>{state.threads.reduce((a, t) => a + t.unread, 0)}</span> : null}
          </button>
        ))}
      </div>
      {tab === 'listings' && <Listings />}
      {tab === 'orders' && <Orders />}
      {tab === 'offers' && <OffersSwaps />}
      {tab === 'wishlist' && <Wishlist />}
      {tab === 'earnings' && <Earnings />}
      {tab === 'messages' && <Messages threadParam={sp.get('thread')} />}
      {tab === 'measurements' && <Measurements />}
    </div>
  );
}

function Listings() {
  const { products, state, removeProduct, editPrice } = useStore();
  const mine = products.filter((p) => p.sellerId === 'me');
  const [editing, setEditing] = useState(null);
  const [val, setVal] = useState(0);
  if (!mine.length) return <div className="empty"><p>You haven't listed anything yet.</p><Link to="/sell" className="btn btn-primary" style={{ marginTop: 12 }}>List an item</Link></div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {mine.map((p) => (
        <div key={p.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to={`/product/${p.id}`} style={{ width: 56, height: 56, background: '#F4F0E6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Garment type={p.type} color={p.color} pattern={p.pattern} /></Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{p.views} views · {p.likes} likes · {p.sold ? 'Sold' : 'Active'}</div>
          </div>
          {editing === p.id ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="number" value={val} onChange={(e) => setVal(+e.target.value)} style={{ width: 90, border: '1.5px solid var(--line)', borderRadius: 8, padding: '6px 8px' }} />
              <button className="icon-btn" onClick={() => { editPrice(p.id, val); setEditing(null); }}><Check size={14} /></button>
            </div>
          ) : <div style={{ fontWeight: 800 }}>{inr(p.price)}</div>}
          <button className="icon-btn" onClick={() => { setEditing(p.id); setVal(p.price); }}><Edit3 size={14} /></button>
          <button className="icon-btn" onClick={() => removeProduct(p.id)}><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function Orders() {
  const { state, productById, sellerOf: sOf, advanceOrder } = useStore();
  if (!state.orders.length) return <div className="empty">No orders yet.</div>;
  const STEPS = ['paid', 'shipped', 'delivered', 'completed'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {state.orders.map((o) => {
        const seller = sellerOf(o.sellerId);
        const idx = STEPS.indexOf(o.status);
        return (
          <div key={o.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 52, height: 52, background: '#F4F0E6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Garment type={o.item.type} color={o.item.color} pattern={o.item.pattern} /></div>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>{o.item.title}</div><div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{o.id} · Sold by {seller.name} · {inr(o.total)}</div></div>
              </div>
              {o.status !== 'completed' && <button className="btn btn-outline btn-sm" onClick={() => advanceOrder(o.id)}>Simulate: mark {STEPS[idx + 1]}</button>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 4, borderRadius: 4, background: i <= idx ? 'var(--sage)' : '#EFE9DB', marginBottom: 5 }} />
                  <div style={{ fontSize: 10.5, textTransform: 'capitalize', color: i <= idx ? 'var(--ink)' : '#B7B29F', fontWeight: i === idx ? 800 : 500 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OffersSwaps() {
  const { state, products, respondCounter, respondOffer, acceptSwapCounter, respondSwap, completeSwap } = useStore();
  const incoming = state.offers.filter((o) => o.dir === 'in');
  const outgoing = state.offers.filter((o) => o.dir === 'out');
  const swOut = state.swaps.filter((s) => s.dir === 'out');
  const swIn = state.swaps.filter((s) => s.dir === 'in');
  const prod = (id) => products.find((p) => p.id === id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h4 style={{ marginBottom: 12 }}>Offers on your listings</h4>
        {!incoming.length ? <p style={{ color: 'var(--ink-soft)', fontSize: 13.5 }}>No offers yet.</p> : incoming.map((o) => {
          const p = prod(o.productId); const buyer = partyOf({ type: 'buyer', id: o.party });
          return (
            <div key={o.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 46, height: 46, background: '#F4F0E6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Garment type={p.type} color={p.color} pattern={p.pattern} /></div>
              <div style={{ flex: 1 }}><b style={{ fontSize: 13.5 }}>{buyer.name}</b> offered <b>{inr(o.amount)}</b> on "{p.title}" <span style={{ color: 'var(--ink-soft)' }}>({inr(p.price)} listed)</span></div>
              {o.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-sm btn-primary" onClick={() => respondOffer(o, 'accept')}>Accept</button>
                  <button className="btn btn-sm btn-outline" onClick={() => respondOffer(o, 'counter', Math.round((o.amount + p.price) / 2 / 10) * 10)}>Counter</button>
                  <button className="btn btn-sm btn-danger" onClick={() => respondOffer(o, 'decline')}>Decline</button>
                </div>
              ) : <span className="pill" style={{ textTransform: 'capitalize' }}>{o.status}</span>}
            </div>
          );
        })}
      </div>
      <div>
        <h4 style={{ marginBottom: 12 }}>Your offers</h4>
        {!outgoing.length ? <p style={{ color: 'var(--ink-soft)', fontSize: 13.5 }}>You haven't made any offers.</p> : outgoing.map((o) => {
          const p = prod(o.productId);
          return (
            <div key={o.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 46, height: 46, background: '#F4F0E6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Garment type={p.type} color={p.color} pattern={p.pattern} /></div>
              <div style={{ flex: 1 }}>You offered <b>{inr(o.amount)}</b> on "{p.title}"{o.status === 'countered' && <> · seller countered <b>{inr(o.counter)}</b></>}</div>
              {o.status === 'countered' ? (
                <div style={{ display: 'flex', gap: 6 }}><button className="btn btn-sm btn-primary" onClick={() => respondCounter(o.id, true)}>Accept {inr(o.counter)}</button><button className="btn btn-sm btn-outline" onClick={() => respondCounter(o.id, false)}>Decline</button></div>
              ) : <span className="pill" style={{ textTransform: 'capitalize' }}>{o.status}</span>}
              {o.status === 'accepted' && <Link to={`/checkout/${p.id}`} className="btn btn-sm btn-primary">Checkout</Link>}
            </div>
          );
        })}
      </div>
      <div>
        <h4 style={{ marginBottom: 12 }}>Swap proposals</h4>
        {[...swOut, ...swIn].length === 0 ? <p style={{ color: 'var(--ink-soft)', fontSize: 13.5 }}>No swap proposals yet. Try one from a swap-eligible product page.</p> : [...swOut, ...swIn].map((s) => {
          const p = prod(s.productId);
          return (
            <div key={s.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Garment type={s.item.type} color={s.item.color} pattern={s.item.pattern} style={{ width: 40, height: 46 }} />
                  <Repeat size={14} style={{ alignSelf: 'center', color: 'var(--ink-soft)' }} />
                  <Garment type={p.type} color={p.color} pattern={p.pattern} style={{ width: 40, height: 46 }} />
                </div>
                <div style={{ flex: 1, fontSize: 13 }}>{s.dir === 'out' ? `Your ${s.item.name} for "${p.title}"` : `Their ${s.item.name} for your "${p.title}"`}{s.topUp > 0 && <> + {inr(s.topUp)}</>}</div>
                <span className="pill" style={{ textTransform: 'capitalize' }}>{s.status}</span>
              </div>
              {s.status === 'countered' && s.dir === 'out' && <button className="btn btn-sm btn-primary" onClick={() => acceptSwapCounter(s.id)}>Add {inr(s.ask)} & accept</button>}
              {s.status === 'pending' && s.dir === 'in' && <div style={{ display: 'flex', gap: 6 }}><button className="btn btn-sm btn-primary" onClick={() => respondSwap(s.id, true)}>Accept</button><button className="btn btn-sm btn-danger" onClick={() => respondSwap(s.id, false)}>Decline</button></div>}
              {s.status === 'accepted' && <button className="btn btn-sm btn-outline" onClick={() => completeSwap(s)}>Mark shipped both ways → complete</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Wishlist() {
  const { products, state } = useStore();
  const items = products.filter((p) => state.wishlist.includes(p.id));
  if (!items.length) return <div className="empty">Nothing saved yet. Tap the heart on any item to save it here.</div>;
  return <div className="grid-products">{items.map((p) => (
    <Link key={p.id} to={`/product/${p.id}`} className="p-card">
      <div className="p-media"><Garment type={p.type} color={p.color} pattern={p.pattern} hanger /></div>
      <div className="p-body"><span className="p-title">{p.title}</span><Price price={p.price} mrp={p.mrp} /></div>
    </Link>
  ))}</div>;
}

function Earnings() {
  const { state, withdraw, toast } = useStore();
  const e = useMemo(() => earningsSummary(state), [state]);
  const max = Math.max(...e.months, 1);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 700 }}>Available to withdraw</div><div style={{ fontFamily: 'var(--serif)', fontSize: 30, margin: '4px 0 10px' }}>{inr(e.available)}</div><button className="btn btn-primary btn-sm" disabled={!e.available} onClick={() => { const amt = withdraw(); toast(`${inr(amt)} sent to your bank account`); }}>Withdraw</button></div>
        <div className="card" style={{ padding: 20 }}><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 700 }}>In escrow / to ship</div><div style={{ fontFamily: 'var(--serif)', fontSize: 30, margin: '4px 0' }}>{inr(e.escrow)}</div><div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Releases after delivery confirmation</div></div>
        <div className="card" style={{ padding: 20 }}><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 700 }}>Lifetime earnings</div><div style={{ fontFamily: 'var(--serif)', fontSize: 30, margin: '4px 0' }}>{inr(e.lifetime)}</div><div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{FEES.sellerPct * 100}% platform fee already deducted</div></div>
      </div>
      <div className="card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Monthly earnings</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
          {e.months.map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 110, display: 'flex', alignItems: 'flex-end' }}><div style={{ width: '100%', height: `${(m / max) * 100}%`, background: i === e.months.length - 1 ? 'var(--sage)' : '#DCE6D8', borderRadius: '6px 6px 0 0' }} /></div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 4 }}>{i === e.months.length - 1 ? 'Now' : `M-${e.months.length - 1 - i}`}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: 12 }}>Recent sales</h4>
        {state.sales.map((s) => (
          <div key={s.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Garment type={s.type} color={s.color} pattern={s.pattern} style={{ width: 40, height: 46 }} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{s.title}</div><div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{s.buyer} · {fmtDate(s.date)}</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>{inr(netOf(s))}</div><span className="pill" style={{ textTransform: 'capitalize' }}>{s.status.replace('_', ' ')}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Messages({ threadParam }) {
  const { state, sellerOf: sOf, ensureThread, markRead, sendMessage, typing } = useStore();
  const [active, setActive] = useState(threadParam || state.threads[0]?.id);
  const [text, setText] = useState('');
  const bottomRef = useRef();
  useEffect(() => { if (threadParam) setActive(threadParam); }, [threadParam]);
  useEffect(() => { if (active) markRead(active); }, [active, state.threads.length]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'nearest' }); }, [active, state.threads]);
  const thread = state.threads.find((t) => t.id === active);
  const who = thread ? partyOf(thread.party) : null;
  const send = () => { if (!text.trim()) return; sendMessage(active, text); setText(''); };
  if (!state.threads.length) return <div className="empty">No conversations yet.</div>;
  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 480, overflow: 'hidden' }}>
      <div style={{ borderRight: '1px solid var(--line)' }}>
        {state.threads.map((t) => {
          const p = partyOf(t.party); const last = t.messages[t.messages.length - 1];
          return (
            <button key={t.id} onClick={() => setActive(t.id)} style={{ display: 'flex', gap: 10, padding: 13, width: '100%', textAlign: 'left', background: active === t.id ? '#F4F0E6' : 'transparent', borderBottom: '1px solid var(--line)' }}>
              <Avatar name={p.name} hue={p.hue} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ fontSize: 13 }}>{p.name}</b>{t.unread > 0 && <span className="badge-dot" style={{ position: 'static' }}>{t.unread}</span>}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last?.text}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {thread && (<>
          <div style={{ padding: 14, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={who.name} hue={who.hue} size={32} /><b style={{ fontSize: 14 }}>{who.name}</b></div>
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 340 }}>
            {thread.messages.map((m) => (
              <div key={m.id} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{ background: m.from === 'me' ? 'var(--ink)' : '#F1ECE0', color: m.from === 'me' ? '#fff' : 'var(--ink)', padding: '9px 13px', borderRadius: 14, fontSize: 13.5 }}>{m.text}</div>
              </div>
            ))}
            {typing[active] && <div style={{ fontSize: 12, color: 'var(--ink-soft)' }} className="dots"><span>•</span><span>•</span><span>•</span></div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ display: 'flex', gap: 8, padding: 14, borderTop: '1px solid var(--line)' }}>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message…" style={{ flex: 1, border: '1.5px solid var(--line)', borderRadius: 100, padding: '10px 16px' }} />
            <button className="icon-btn" onClick={send}><Send size={15} /></button>
          </div>
        </>)}
      </div>
    </div>
  );
}

function Measurements() {
  const { state, setMeasurements, toast } = useStore();
  const [m, setM] = useState(state.measurements);
  const save = () => { setMeasurements(m); toast('Measurements saved. Fit Match will use these from now on.'); };
  const F = [['height', 'Height (cm)'], ['chest', 'Chest / bust (cm)'], ['waist', 'Waist (cm)'], ['hips', 'Hips (cm)'], ['shoulder', 'Shoulder (cm)'], ['foot', 'Foot length (cm)']];
  return (
    <div style={{ maxWidth: 460 }}>
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 700, marginBottom: 4 }}><ShieldCheck size={16} /> Your measurements</div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 16 }}>Used privately to power Smart Fit Match on every listing.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {F.map(([k, l]) => <div className="field" key={k}><label>{l}</label><input type="number" value={m[k]} onChange={(e) => setM((s) => ({ ...s, [k]: +e.target.value }))} /></div>)}
        </div>
        <div className="field"><label>Preferred fit</label><div className="chip-row">{['slim', 'regular', 'relaxed'].map((f) => <button key={f} className={`chip ${m.fitPref === f ? 'active' : ''}`} onClick={() => setM((s) => ({ ...s, fitPref: f }))}>{f}</button>)}</div></div>
        <button className="btn btn-primary btn-block" onClick={save}>Save measurements</button>
      </div>
    </div>
  );
}
