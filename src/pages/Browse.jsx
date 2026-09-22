import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { SlidersHorizontal, X, Search } from '../components/icons.jsx';
import { useStore } from '../store.jsx';
import { CATEGORIES, SIZES_BY_SLOT, TYPES } from '../data/catalog';
import { BRANDS } from '../lib/pricing';
import { FAMILIES } from '../lib/color';
import { parseQuery } from '../lib/search';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
const SORTS = { relevant: 'Most relevant', new: 'Newest first', low: 'Price: low to high', high: 'Price: high to low', popular: 'Most liked' };

export default function Browse() {
  const { products } = useStore();
  const [sp, setSp] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const qParam = sp.get('q') || '';
  const [q, setQ] = useState(qParam);
  const [f, setF] = useState({ cat: sp.get('cat') || '', sizes: [], colors: [], conditions: [], maxPrice: 6000, dept: '', swapOnly: false, sort: 'relevant' });

  useEffect(() => { setQ(qParam); }, [qParam]);
  const parsed = useMemo(() => parseQuery(q), [q]);

  const toggle = (key, val) => setF((s) => ({ ...s, [key]: s[key].includes(val) ? s[key].filter((x) => x !== val) : [...s[key], val] }));

  const results = useMemo(() => {
    let r = products.filter((p) => !p.sold);
    if (f.cat) r = r.filter((p) => p.category === f.cat);
    if (parsed.types.length) r = r.filter((p) => parsed.types.includes(p.type));
    if (parsed.families.length) r = r.filter((p) => parsed.families.includes(p.family));
    if (parsed.dept) r = r.filter((p) => p.dept === parsed.dept);
    if (parsed.tag) r = r.filter((p) => p.tags.includes(parsed.tag));
    if (parsed.size) r = r.filter((p) => p.size === parsed.size);
    if (parsed.maxPrice) r = r.filter((p) => p.price <= parsed.maxPrice);
    const rest = parsed.rest.trim();
    if (rest) r = r.filter((p) => (p.title + p.brand + p.description).toLowerCase().includes(rest));
    if (f.sizes.length) r = r.filter((p) => f.sizes.includes(p.size));
    if (f.colors.length) r = r.filter((p) => f.colors.includes(p.family));
    if (f.conditions.length) r = r.filter((p) => f.conditions.includes(p.condition));
    if (f.dept) r = r.filter((p) => p.dept === f.dept);
    if (f.swapOnly) r = r.filter((p) => p.swap);
    r = r.filter((p) => p.price <= f.maxPrice);
    if (f.sort === 'low') r = [...r].sort((a, b) => a.price - b.price);
    else if (f.sort === 'high') r = [...r].sort((a, b) => b.price - a.price);
    else if (f.sort === 'new') r = [...r].sort((a, b) => b.listedAt - a.listedAt);
    else if (f.sort === 'popular') r = [...r].sort((a, b) => b.likes - a.likes);
    return r;
  }, [products, f, parsed]);

  const onSubmit = (e) => { e.preventDefault(); setSp(q ? { q } : {}); };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
        <div className="nav-search" style={{ maxWidth: 'none', flex: 1 }}>
          <Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Try "sage kurta under 1500" or "black jeans size 28"' />
        </div>
        <button className="btn btn-outline" type="button" onClick={() => setShowFilters((s) => !s)}><SlidersHorizontal size={15} /> Filters</button>
      </form>
      {parsed.chips.length > 0 && <div className="chip-row" style={{ margin: '10px 0' }}>{parsed.chips.map((c) => <span key={c} className="pill">{c}</span>)}</div>}

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 0 18px' }}>
        <button className={`chip ${!f.cat ? 'active' : ''}`} onClick={() => setF((s) => ({ ...s, cat: '' }))}>All</button>
        {CATEGORIES.map((c) => <button key={c} className={`chip ${f.cat === c ? 'active' : ''}`} onClick={() => setF((s) => ({ ...s, cat: c }))}>{c}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '250px 1fr' : '1fr', gap: 28 }}>
        {showFilters && (
          <aside className="card fade-in" style={{ padding: 20, alignSelf: 'start', position: 'sticky', top: 84 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><b style={{ fontSize: 14 }}>Filters</b><button className="icon-btn" onClick={() => setShowFilters(false)}><X size={15} /></button></div>
            <div className="field"><label>Department</label>
              <div className="chip-row">{['', 'Women', 'Men', 'Unisex'].map((d) => <button key={d} className={`chip ${f.dept === d ? 'active' : ''}`} onClick={() => setF((s) => ({ ...s, dept: d }))}>{d || 'Any'}</button>)}</div>
            </div>
            <div className="field"><label>Size</label>
              <div className="chip-row">{ALL_SIZES.map((s) => <button key={s} className={`chip ${f.sizes.includes(s) ? 'active' : ''}`} onClick={() => toggle('sizes', s)}>{s}</button>)}</div>
            </div>
            <div className="field"><label>Colour</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{Object.entries(FAMILIES).map(([n, hex]) => (
                <button key={n} title={n} className={`swatch ${f.colors.includes(n) ? 'active' : ''}`} style={{ background: hex }} onClick={() => toggle('colors', n)} />
              ))}</div>
            </div>
            <div className="field"><label>Condition</label>
              <div className="chip-row">{['New with tags', 'Like new', 'Gently used', 'Well loved'].map((c) => <button key={c} className={`chip ${f.conditions.includes(c) ? 'active' : ''}`} onClick={() => toggle('conditions', c)}>{c}</button>)}</div>
            </div>
            <div className="field"><label>Max price · ₹{f.maxPrice}</label>
              <input type="range" min="200" max="6000" step="100" value={f.maxPrice} onChange={(e) => setF((s) => ({ ...s, maxPrice: +e.target.value }))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={f.swapOnly} onChange={(e) => setF((s) => ({ ...s, swapOnly: e.target.checked }))} /> Swap-eligible only
            </label>
          </aside>
        )}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: 'var(--ink-soft)', fontSize: 13.5 }}>{results.length} items</span>
            <select value={f.sort} onChange={(e) => setF((s) => ({ ...s, sort: e.target.value }))} style={{ border: '1.5px solid var(--line)', borderRadius: 100, padding: '7px 12px', fontSize: 13, fontWeight: 600 }}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {results.length === 0 ? (
            <div className="empty"><p style={{ fontSize: 16, marginBottom: 6 }}>No items match yet</p><p style={{ fontSize: 13.5 }}>Try clearing a filter or searching something broader.</p></div>
          ) : <div className="grid-products">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
        </div>
      </div>
    </div>
  );
}
