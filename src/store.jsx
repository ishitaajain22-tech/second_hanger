import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { PRODUCTS, buildProduct } from './data/products';
import { SELLERS, ME, BUYERS } from './data/sellers';
import { DEFAULT_MEASUREMENTS, SEED_WARDROBE, SEED_ORDERS, SEED_SALES, SEED_OFFERS, SEED_SWAPS, SEED_THREADS, SEED_HISTORY } from './data/seed';
import { FEES } from './config';
import { netOf } from './lib/impact';
import { inr } from './lib/format';

const KEY = 'dobara:v2';
const initial = () => ({
  wishlist: ['p1', 'p9', 'p19'], added: [], edits: {}, removedIds: [], soldIds: [], orders: SEED_ORDERS, sales: SEED_SALES,
  offers: SEED_OFFERS, swaps: SEED_SWAPS, threads: SEED_THREADS, wardrobe: SEED_WARDROBE, measurements: DEFAULT_MEASUREMENTS,
  savedOutfits: [], history: SEED_HISTORY, withdrawn: 0,
});
function load() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...initial(), ...JSON.parse(raw) };
    }
  } catch { /* ignore */ }
  return initial();
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const uid = (p = 'x') => p + Math.random().toString(36).slice(2, 8);

export const sellerOf = (id) => (id === 'me' ? ME : SELLERS.find((s) => s.id === id));
export const partyOf = (party) => (party.type === 'seller' ? sellerOf(party.id) : BUYERS.find((b) => b.id === party.id));

const REPLIES = [
  [/price|offer|discount|less|negot/i, 'I can do a little off. Send me an offer through the app and I will have a look 🙌'],
  [/ship|deliver|courier|dispatch/i, 'I ship within 24 hours via Delhivery, with tracking and steamed, plastic-free packaging.'],
  [/measure|size|fit|length|waist|chest/i, 'Happy to help! The full measurements are in the listing, and I can measure anything specific if you need it.'],
  [/swap|exchange|trade/i, 'I am open to swaps! Send me a proposal with your item and we will make it work.'],
  [/stain|flaw|damage|condition|wear/i, 'No stains or damage at all. The photos are unedited and I mention every flaw in the description.'],
];

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);
  const [typing, setTyping] = useState({});
  const timers = useRef([]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };

  const toast = useCallback((text, kind = 'ok') => {
    const id = uid('t');
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const products = useMemo(() => {
    const removed = new Set(state.removedIds);
    const sold = new Set(state.soldIds);
    return [...state.added, ...PRODUCTS]
      .filter((p) => !removed.has(p.id))
      .map((p) => ({ ...p, ...(state.edits[p.id] || {}), sold: sold.has(p.id) }));
  }, [state.added, state.edits, state.removedIds, state.soldIds]);
  const productById = useCallback((id) => products.find((p) => p.id === id), [products]);

  const A = useMemo(() => {
    const set = setState;
    const addMsg = (threadId, msg) => set((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, { id: uid('m'), ts: Date.now(), ...msg }], unread: msg.from === 'them' ? t.unread + 1 : t.unread } : t)) }));
    const ensureThread = (party, productId, first) => {
      let id = null;
      set((s) => {
        const ex = s.threads.find((t) => t.party.id === party.id && t.productId === productId);
        if (ex) { id = ex.id; return s; }
        id = uid('t');
        return { ...s, threads: [{ id, party, productId, unread: 0, messages: first ? [{ id: uid('m'), from: 'me', text: first, ts: Date.now() }] : [] }, ...s.threads] };
      });
      return id;
    };

    return {
      toggleWishlist: (id) => set((s) => ({ ...s, wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),

      setMeasurements: (m) => set((s) => ({ ...s, measurements: { ...s.measurements, ...m } })),

      addProduct: (data) => {
        const p = buildProduct(['u' + Date.now().toString(36), data.title, data.brand, data.type, data.color, data.colorName, data.pattern, data.size, data.condition, data.price, data.mrp, 'me', data.dept || 'Women', data.cut || 'regular', (data.tags || ['casual']).join(','), data.swap ? 1 : 0, 0]);
        p.measures = data.measures || p.measures;
        p.description = data.description || p.description;
        p.photos = data.photos || [];
        p.aiListed = true;
        set((s) => ({ ...s, added: [p, ...s.added] }));
        return p;
      },
      editPrice: (id, price) => set((s) => ({ ...s, edits: { ...s.edits, [id]: { ...(s.edits[id] || {}), price } } })),
      removeProduct: (id) => set((s) => ({ ...s, removedIds: [...s.removedIds, id], added: s.added.filter((p) => p.id !== id) })),

      placeOrder: (product, { price, address, pay }) => {
        const fee = Math.round(price * FEES.buyerProtectionPct);
        const order = {
          id: 'DBR-' + Math.floor(10000 + Math.random() * 89999), productId: product.id, sellerId: product.sellerId,
          item: { title: product.title, type: product.type, color: product.color, pattern: product.pattern, brand: product.brand, mrp: product.mrp },
          price, shipping: FEES.shipping, fee, total: price + FEES.shipping + fee, status: 'paid', placedAt: Date.now(), address, pay,
          timeline: [{ s: 'paid', ts: Date.now() }],
        };
        set((s) => ({ ...s, orders: [order, ...s.orders], soldIds: [...s.soldIds, product.id], wishlist: s.wishlist.filter((x) => x !== product.id) }));
        return order;
      },
      advanceOrder: (id) => set((s) => ({
        ...s, orders: s.orders.map((o) => {
          if (o.id !== id) return o;
          const next = { paid: 'shipped', shipped: 'delivered', delivered: 'completed' }[o.status];
          return next ? { ...o, status: next, timeline: [...o.timeline, { s: next, ts: Date.now() }] } : o;
        }),
      })),
      shipSale: (id) => set((s) => ({ ...s, sales: s.sales.map((x) => (x.id === id ? { ...x, status: 'in_escrow' } : x)) })),
      releaseSale: (id) => set((s) => ({ ...s, sales: s.sales.map((x) => (x.id === id ? { ...x, status: 'available' } : x)) })),
      withdraw: () => {
        let total = 0;
        set((s) => {
          total = s.sales.filter((x) => x.status === 'available').reduce((a, x) => a + netOf(x), 0);
          return { ...s, sales: s.sales.map((x) => (x.status === 'available' ? { ...x, status: 'paid_out' } : x)) };
        });
        return total;
      },

      makeOffer: (product, amount, message) => {
        const sel = sellerOf(product.sellerId);
        const offer = { id: uid('o'), dir: 'out', productId: product.id, party: product.sellerId, amount, status: 'pending', ts: Date.now(), note: message || '' };
        const tid = ensureThread({ type: 'seller', id: product.sellerId }, product.id);
        set((s) => ({ ...s, offers: [offer, ...s.offers] }));
        addMsg(tid, { from: 'me', text: `Offer sent: ${inr(amount)} for "${product.title}". ${message || ''}`.trim() });
        later(() => {
          const ratio = amount / product.price;
          let patch, reply, msg;
          if (ratio >= 0.88) { patch = { status: 'accepted', agreed: amount }; reply = `Deal! ${inr(amount)} works for me. It is reserved for you for 24 hours 🎉`; msg = `${sel.name.split(' ')[0]} accepted your offer of ${inr(amount)}!`; }
          else if (ratio >= 0.72) { const c = Math.max(amount + 10, Math.round((amount + product.price) / 2 / 10) * 10); patch = { status: 'countered', counter: c }; reply = `Thanks for the offer! I can do ${inr(c)}, which is my best price.`; msg = `${sel.name.split(' ')[0]} countered with ${inr(c)}`; }
          else { patch = { status: 'declined' }; reply = 'Thanks, but I cannot go that low. Happy to consider a higher offer!'; msg = `${sel.name.split(' ')[0]} declined your offer`; }
          set((s) => ({ ...s, offers: s.offers.map((o) => (o.id === offer.id ? { ...o, ...patch } : o)) }));
          addMsg(tid, { from: 'them', text: reply });
          toast(msg, patch.status === 'declined' ? 'warn' : 'ok');
        }, 4200);
        return offer;
      },
      respondCounter: (id, accept) => set((s) => ({ ...s, offers: s.offers.map((o) => (o.id === id ? (accept ? { ...o, status: 'accepted', agreed: o.counter } : { ...o, status: 'declined' }) : o)) })),
      respondOffer: (offer, action, counterAmt) => {
        const p = PRODUCTS.find((x) => x.id === offer.productId);
        if (action === 'accept') {
          set((s) => ({ ...s, offers: s.offers.map((o) => (o.id === offer.id ? { ...o, status: 'accepted', agreed: o.amount } : o)) }));
          later(() => {
            const buyer = BUYERS.find((b) => b.id === offer.party);
            set((s) => ({
              ...s, soldIds: [...s.soldIds, offer.productId],
              sales: [{ id: 'SL-' + Math.floor(2100 + Math.random() * 800), title: p.title, type: p.type, color: p.color, pattern: p.pattern, price: offer.amount, buyer: buyer.name, date: Date.now(), status: 'to_ship', live: true }, ...s.sales],
            }));
            toast(`${buyer.name} paid ${inr(offer.amount)}. Ship "${p.title}" within 48h`, 'ok');
          }, 2500);
        } else if (action === 'decline') set((s) => ({ ...s, offers: s.offers.map((o) => (o.id === offer.id ? { ...o, status: 'declined' } : o)) }));
        else if (action === 'counter') set((s) => ({ ...s, offers: s.offers.map((o) => (o.id === offer.id ? { ...o, status: 'countered', counter: counterAmt } : o)) }));
      },

      proposeSwap: (product, wItem, value, topUp, note) => {
        const sw = { id: uid('w'), dir: 'out', productId: product.id, party: product.sellerId, status: 'pending', ts: Date.now(), topUp, note, item: { name: wItem.name, type: wItem.type, color: wItem.color, pattern: wItem.pattern, value, wid: wItem.id } };
        const sel = sellerOf(product.sellerId);
        const tid = ensureThread({ type: 'seller', id: product.sellerId }, product.id);
        set((s) => ({ ...s, swaps: [sw, ...s.swaps] }));
        addMsg(tid, { from: 'me', text: `Swap proposal: my ${wItem.name}${topUp ? ` + ${inr(Math.abs(topUp))} ${topUp > 0 ? 'from me' : 'from you'}` : ''} for your "${product.title}".` });
        later(() => {
          const ok = value + topUp >= product.price * 0.85;
          const ask = Math.max(0, Math.round((product.price * 0.9 - value) / 10) * 10);
          set((s) => ({ ...s, swaps: s.swaps.map((x) => (x.id === sw.id ? (ok ? { ...x, status: 'accepted' } : { ...x, status: 'countered', ask }) : x)) }));
          addMsg(tid, { from: 'them', text: ok ? 'Love your piece! Swap accepted. Let us both ship this week 🔄' : `Nice item! Could you add ${inr(ask)} to balance the value? Then it is a swap.` });
          toast(ok ? `${sel.name.split(' ')[0]} accepted your swap!` : `${sel.name.split(' ')[0]} asked for ${inr(ask)} top-up`, 'ok');
        }, 5200);
        return sw;
      },
      acceptSwapCounter: (id) => set((s) => ({ ...s, swaps: s.swaps.map((x) => (x.id === id ? { ...x, status: 'accepted', topUp: x.ask } : x)) })),
      respondSwap: (id, accept) => set((s) => ({ ...s, swaps: s.swaps.map((x) => (x.id === id ? { ...x, status: accept ? 'accepted' : 'declined' } : x)) })),
      completeSwap: (sw) => {
        set((s) => {
          const other = PRODUCTS.find((p) => p.id === sw.productId);
          let wardrobe = s.wardrobe;
          let soldIds = s.soldIds;
          if (sw.dir === 'out') {
            wardrobe = wardrobe.filter((w) => w.id !== sw.item.wid);
            wardrobe = [{ id: uid('w'), name: other.title, type: other.type, color: other.color, colorName: other.colorName, pattern: other.pattern, brand: other.brand, size: other.size, tags: other.tags, worn: 0, swapReady: false, cut: other.cut, source: 'swap' }, ...wardrobe];
            soldIds = [...soldIds, other.id];
          } else {
            wardrobe = [{ id: uid('w'), name: sw.item.name, type: sw.item.type, color: sw.item.color, colorName: 'Grey', pattern: sw.item.pattern, brand: 'Puma', size: 'M', tags: ['casual', 'college'], worn: 0, swapReady: false, cut: 'regular', source: 'swap' }, ...wardrobe];
            soldIds = [...soldIds, sw.productId];
          }
          return { ...s, wardrobe, soldIds, swaps: s.swaps.map((x) => (x.id === sw.id ? { ...x, status: 'completed' } : x)) };
        });
        toast('Swap completed! The new piece is in your digital closet ✨');
      },

      ensureThread,
      sendMessage: (threadId, text) => {
        addMsg(threadId, { from: 'me', text });
        setTyping((t) => ({ ...t, [threadId]: true }));
        later(() => {
          const hit = REPLIES.find(([re]) => re.test(text));
          setTyping((t) => ({ ...t, [threadId]: false }));
          addMsg(threadId, { from: 'them', text: hit ? hit[1] : 'Thanks for reaching out! Happy to help. Let me know if you have any questions 😊' });
        }, 1700 + Math.random() * 900);
      },
      markRead: (threadId) => set((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId && t.unread ? { ...t, unread: 0 } : t)) })),

      addWardrobeItems: (items) => set((s) => ({ ...s, wardrobe: [...items.map((i) => ({ id: uid('w'), worn: 0, swapReady: false, cut: 'regular', source: 'scan', ...i, tags: Array.isArray(i.tags) ? i.tags : String(i.tags || 'casual').split(',') })), ...s.wardrobe] })),
      updateWardrobeItem: (id, patch) => set((s) => ({ ...s, wardrobe: s.wardrobe.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
      removeWardrobeItem: (id) => set((s) => ({ ...s, wardrobe: s.wardrobe.filter((w) => w.id !== id) })),
      saveOutfit: (o) => set((s) => (s.savedOutfits.find((x) => x.sig === o.sig) ? s : { ...s, savedOutfits: [{ ...o, savedAt: Date.now() }, ...s.savedOutfits] })),
      unsaveOutfit: (sig) => set((s) => ({ ...s, savedOutfits: s.savedOutfits.filter((x) => x.sig !== sig) })),

      resetDemo: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setState(initial()); },
    };
  }, [toast]);

  const unread = state.threads.reduce((a, t) => a + t.unread, 0);
  const value = { state, products, productById, sellerOf, partyOf, me: ME, toasts, typing, toast, unread, ...A };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
