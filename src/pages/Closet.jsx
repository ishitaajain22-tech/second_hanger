import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import AIProcessing from '../components/AIProcessing.jsx';
import Modal from '../components/Modal.jsx';
import { Camera, Sparkles, Check, Plus, Repeat, Trash2, Wand2, X } from '../components/icons.jsx';
import { useStore } from '../store.jsx';
import { TYPES, CATEGORIES } from '../data/catalog';
import { SCAN_POOL } from '../data/seed';
import { rng, hashStr } from '../lib/format';

const SCAN_STEPS = [{ label: 'Reading photo for garments' }, { label: 'Isolating each item' }, { label: 'Matching colour, type & brand cues' }, { label: 'Building your digital closet' }];

export default function Closet() {
  const { state, addWardrobeItems, removeWardrobeItem } = useStore();
  const fileRef = useRef();
  const nav = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(null);
  const [picked, setPicked] = useState([]);
  const [cat, setCat] = useState('');

  const startScan = () => {
    setScanning(true);
    const r = rng(Date.now());
    const items = [...SCAN_POOL].sort(() => r() - 0.5).slice(0, 3 + Math.floor(r() * 2));
    setTimeout(() => { setFound(items); setPicked(items.map((_, i) => i)); }, 10);
  };
  const finishScan = () => {
    addWardrobeItems(found.filter((_, i) => picked.includes(i)).map((f) => ({ name: f.name, type: f.type, color: f.color, colorName: f.colorName, pattern: f.pattern, brand: f.brand, size: f.size, tags: f.tags })));
    setScanning(false); setFound(null);
  };

  const items = useMemo(() => cat ? state.wardrobe.filter((w) => TYPES[w.type].cat === cat) : state.wardrobe, [state.wardrobe, cat]);
  const cats = useMemo(() => [...new Set(state.wardrobe.map((w) => TYPES[w.type].cat))], [state.wardrobe]);

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 6 }}>
        <div><div className="eyebrow"><Wand2 size={13} /> AI Wardrobe Visualizer</div><h1 style={{ fontSize: 30 }}>Your digital closet</h1></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/stylist" className="btn btn-outline"><Sparkles size={15} /> Style me</Link>
          <button className="btn btn-primary" onClick={startScan}><Camera size={16} /> Scan wardrobe</button>
        </div>
      </div>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>{state.wardrobe.length} items catalogued · Tap any piece to recolour it with the AI Wardrobe Changer.</p>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
        <button className={`chip ${!cat ? 'active' : ''}`} onClick={() => setCat('')}>All</button>
        {cats.map((c) => <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: 16, marginBottom: 8 }}>No items in this category yet</p>
          <button className="btn btn-primary" onClick={startScan}><Camera size={15} /> Scan a photo of your wardrobe</button>
        </div>
      ) : (
        <div className="grid-products">
          {items.map((w) => (
            <div key={w.id} className="p-card" style={{ cursor: 'pointer' }} onClick={() => nav(`/closet/${w.id}`)}>
              <div className="p-media">
                {w.swapReady && <span className="pill p-badges" style={{ background: '#fff' }}><Repeat size={11} /> Swap ready</span>}
                <button className="icon-btn p-wish" onClick={(e) => { e.stopPropagation(); removeWardrobeItem(w.id); }}><Trash2 size={14} /></button>
                <Garment type={w.type} color={w.color} pattern={w.pattern} fit={w.cut} hanger />
              </div>
              <div className="p-body">
                <span className="p-brand">{w.brand}</span>
                <span className="p-title">{w.name}</span>
                <span className="p-meta">Size {w.size} · Worn {w.worn}×</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {scanning && (
        <Modal title={found ? 'Items found' : 'Scanning wardrobe'} onClose={() => { setScanning(false); setFound(null); }}>
          <div style={{ padding: 20 }}>
            {!found ? <AIProcessing steps={SCAN_STEPS} onDone={() => {}} /> : (
              <>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 14 }}>Found {found.length} items. Uncheck anything you don't want to add.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                  {found.map((f, i) => (
                    <button key={i} onClick={() => setPicked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i])} className="card" style={{ padding: 10, textAlign: 'left', border: picked.includes(i) ? '2px solid var(--sage)' : '1px solid var(--line)', position: 'relative' }}>
                      {picked.includes(i) && <span style={{ position: 'absolute', top: 6, right: 6, background: 'var(--sage)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={11} /></span>}
                      <div style={{ background: '#F4F0E6', borderRadius: 8, marginBottom: 6 }}><Garment type={f.type} color={f.color} pattern={f.pattern} style={{ width: 60, height: 70, margin: '0 auto' }} /></div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{f.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>{f.conf}% confidence</div>
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary btn-block" onClick={finishScan}>Add {picked.length} to closet</button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
