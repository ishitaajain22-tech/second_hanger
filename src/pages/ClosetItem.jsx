import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import AIProcessing from '../components/AIProcessing.jsx';
import { Sparkles, Wand2, ArrowLeft, Repeat, Tag, ShoppingBag } from '../components/icons.jsx';
import { useStore } from '../store.jsx';
import { SWATCHES, generateLooks } from '../lib/ai';
import { nearestColorName } from '../lib/color';
import { PATTERNS, PATTERN_LABEL, FITS, TYPES } from '../data/catalog';
import { suggestPrice } from '../lib/pricing';
import { inr } from '../lib/format';

const GEN_STEPS = [{ label: 'Studying silhouette & drape' }, { label: 'Testing colour palettes' }, { label: 'Rendering style variations' }];

export default function ClosetItem() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, updateWardrobeItem, addProduct } = useStore();
  const item = state.wardrobe.find((w) => w.id === id);
  const [view, setView] = useState(item);
  const [generating, setGenerating] = useState(false);
  const [looks, setLooks] = useState(null);
  const [tab, setTab] = useState('color');

  if (!item) return <div className="container" style={{ padding: 60 }}>Item not found. <Link to="/closet">Back to closet</Link></div>;

  const generate = () => { setGenerating(true); setLooks(null); };
  const onGenDone = () => { setLooks(generateLooks(item, Date.now())); setGenerating(false); };

  const applyLook = (l) => setView((v) => ({ ...v, color: l.color, colorName: nearestColorName(l.color), pattern: l.pattern, cut: l.fit }));
  const save = () => { updateWardrobeItem(item.id, { color: view.color, colorName: view.colorName, pattern: view.pattern, cut: view.cut }); nav('/closet'); };
  const changed = view.color !== item.color || view.pattern !== item.pattern || view.cut !== item.cut;

  const listFromHere = () => {
    const sp = suggestPrice({ type: view.type, brand: view.brand, condition: 'Gently used' });
    const p = addProduct({ title: `${view.brand !== 'Other' ? view.brand + ' ' : ''}${view.colorName} ${TYPES[view.type].label}`, brand: view.brand, type: view.type, color: view.color, colorName: view.colorName, pattern: view.pattern, size: view.size, condition: 'Gently used', price: sp.suggested, mrp: sp.mrp, dept: 'Women', cut: view.cut, tags: view.tags, swap: true });
    nav(`/product/${p.id}`);
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <Link to="/closet" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}><ArrowLeft size={14} /> Back to closet</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44 }}>
        <div>
          <div className="card" style={{ aspectRatio: '1/1.05', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#F4F0E6,#ECE6D6)' }}>
            <Garment type={view.type} color={view.color} pattern={view.pattern} fit={view.cut} hanger style={{ width: '76%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="pill" onClick={() => setView(item)} style={{ opacity: changed ? 1 : .4 }}>Reset to original</button>
            {changed && <span className="pill" style={{ background: 'var(--lime)', color: 'var(--lime-ink)' }}>Preview updated</span>}
          </div>
        </div>

        <div>
          <div className="eyebrow"><Wand2 size={13} /> AI Wardrobe Changer</div>
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>{item.name}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 18 }}>{item.brand} · Size {item.size} · Worn {item.worn} times</p>

          <div className="tabs" style={{ marginBottom: 18 }}>
            <button className={`tab ${tab === 'color' ? 'active' : ''}`} onClick={() => setTab('color')}>Recolour</button>
            <button className={`tab ${tab === 'pattern' ? 'active' : ''}`} onClick={() => setTab('pattern')}>Pattern</button>
            <button className={`tab ${tab === 'fit' ? 'active' : ''}`} onClick={() => setTab('fit')}>Fit</button>
            <button className={`tab ${tab === 'ai' ? 'active' : ''}`} onClick={() => setTab('ai')}>AI looks</button>
          </div>

          {tab === 'color' && (
            <div className="field"><label>Choose a new colour</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>{SWATCHES.map((hex) => <button key={hex} className={`swatch ${view.color === hex ? 'active' : ''}`} style={{ background: hex, width: 34, height: 34 }} onClick={() => setView((v) => ({ ...v, color: hex, colorName: nearestColorName(hex) }))} />)}</div>
            </div>
          )}
          {tab === 'pattern' && (
            <div className="field"><label>Choose a pattern</label>
              <div className="chip-row">{PATTERNS.map((p) => <button key={p} className={`chip ${view.pattern === p ? 'active' : ''}`} onClick={() => setView((v) => ({ ...v, pattern: p }))}>{PATTERN_LABEL[p]}</button>)}</div>
            </div>
          )}
          {tab === 'fit' && (
            <div className="field"><label>Choose a fit</label>
              <div className="chip-row">{FITS.map((f) => <button key={f} className={`chip ${view.cut === f ? 'active' : ''}`} onClick={() => setView((v) => ({ ...v, cut: f }))}>{f}</button>)}</div>
            </div>
          )}
          {tab === 'ai' && (
            <div>
              {!looks && !generating && <button className="btn btn-primary" onClick={generate}><Sparkles size={15} /> Generate AI style variations</button>}
              {generating && <AIProcessing steps={GEN_STEPS} onDone={onGenDone} compact />}
              {looks && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {looks.map((l) => (
                    <button key={l.id} className="card" style={{ padding: 12, textAlign: 'left' }} onClick={() => applyLook(l)}>
                      <div style={{ background: '#F4F0E6', borderRadius: 8, marginBottom: 8 }}><Garment type={view.type} color={l.color} pattern={l.pattern} fit={l.fit} style={{ width: 74, height: 84, margin: '0 auto' }} /></div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{l.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{l.why}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 26, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" disabled={!changed} onClick={save}>Save to closet</button>
            <button className="btn btn-outline" onClick={listFromHere}><Tag size={15} /> List this on marketplace</button>
            <button className="btn btn-outline" onClick={() => updateWardrobeItem(item.id, { swapReady: !item.swapReady })}><Repeat size={15} /> {item.swapReady ? 'Remove from' : 'Mark for'} swap</button>
          </div>
        </div>
      </div>
    </div>
  );
}
