import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import AIProcessing from '../components/AIProcessing.jsx';
import { Camera, ImagePlus, Sparkles, Check, Wand2, ArrowRight } from '../components/icons.jsx';
import { useStore } from '../store.jsx';
import { TYPES, CATEGORIES, SIZES_BY_SLOT, PATTERNS, PATTERN_LABEL, FITS } from '../data/catalog';
import { BRANDS, suggestPrice } from '../lib/pricing';
import { CONDITIONS } from '../config';
import { dominantColor, detectFromFile, titleVariants, descriptionFor, SWATCHES } from '../lib/ai';
import { nearestColorName } from '../lib/color';
import { measuresFor } from '../lib/fit';
import { inr } from '../lib/format';

const STEP_LABELS = [
  { label: 'Removing background from photos' }, { label: 'Detecting item type & fabric' }, { label: 'Matching colour & pattern' }, { label: 'Analysing 40,000+ recent sales' },
];

export default function Sell() {
  const { addProduct } = useStore();
  const nav = useNavigate();
  const fileRef = useRef();
  const [stage, setStage] = useState('upload'); // upload -> analyzing -> form -> done
  const [photos, setPhotos] = useState([]);
  const [d, setD] = useState({ type: 'tee', brand: 'Zara', color: '#E7B7C2', colorName: 'Blush', pattern: 'solid', size: 'M', cut: 'regular', condition: 'Gently used', dept: 'Women', tags: ['casual'] });
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);
  const [swap, setSwap] = useState(true);
  const [created, setCreated] = useState(null);

  const onFiles = async (files) => {
    const list = Array.from(files).slice(0, 4);
    const urls = list.map((f) => URL.createObjectURL(f));
    setPhotos(urls);
    setStage('analyzing');
    const hex = await dominantColor(urls[0]);
    const det = detectFromFile(list[0], hex);
    setTimeout(() => {
      setD((s) => ({ ...s, ...det }));
      const tv = titleVariants(det);
      setTitle(tv[0]);
      setDesc(descriptionFor({ ...det, condition: 'Gently used' }));
      const sp = suggestPrice({ type: det.type, brand: det.brand, condition: 'Gently used' });
      setPrice(sp.suggested);
      setStage('form');
    }, 3100);
  };

  const priceData = suggestPrice({ type: d.type, brand: d.brand, condition: d.condition });
  const measures = measuresFor(d.type, d.size, d.cut);
  const slot = TYPES[d.type].slot;

  const publish = () => {
    const p = addProduct({ title, description: desc, brand: d.brand, type: d.type, color: d.color, colorName: d.colorName, pattern: d.pattern, size: d.size, condition: d.condition, price, mrp: priceData.mrp, dept: d.dept, cut: d.cut, tags: d.tags, swap, measures });
    setCreated(p);
    setStage('done');
  };

  if (stage === 'done' && created) return (
    <div className="container" style={{ padding: '60px 0', maxWidth: 520, textAlign: 'center' }}>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Check size={30} color="var(--lime-ink)" /></div>
      <h2 style={{ marginBottom: 10 }}>Listed! Your item is live.</h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>{title} is now visible to thousands of shoppers on {`Dobara`}.</p>
      <div className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left', marginBottom: 24 }}>
        <div style={{ width: 70, height: 70, background: '#F4F0E6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Garment type={created.type} color={created.color} pattern={created.pattern} /></div>
        <div><div style={{ fontWeight: 700 }}>{created.title}</div><div style={{ color: 'var(--sage-dk)', fontWeight: 800 }}>{inr(created.price)}</div></div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => nav(`/product/${created.id}`)}>View listing</button>
        <button className="btn btn-outline" onClick={() => { setStage('upload'); setPhotos([]); setTitle(''); }}>List another</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60, maxWidth: 720 }}>
      <div className="eyebrow"><Sparkles size={13} /> AI Listing Assistant</div>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Sell an item</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>Upload photos and our AI drafts the title, description and price for you. Edit anything before publishing.</p>

      {stage === 'upload' && (
        <div className="card" style={{ padding: 40, textAlign: 'center', border: '2px dashed var(--line)' }}>
          <ImagePlus size={38} color="var(--ink-soft)" />
          <h3 style={{ margin: '14px 0 6px' }}>Upload item photos</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 20 }}>Up to 4 photos. Good light and a plain background work best.</p>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files.length && onFiles(e.target.files)} />
          <button className="btn btn-primary" onClick={() => fileRef.current.click()}><Camera size={16} /> Choose photos</button>
          <p style={{ fontSize: 12, color: '#A39E8C', marginTop: 14 }}>No photo? <button className="btn btn-ghost btn-sm" onClick={() => onFiles([new File([], 'zara-kurta.jpg')])}>Try a demo photo</button></p>
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>{photos.map((u, i) => <img key={i} src={u} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, background: '#eee' }} />)}</div>
          <AIProcessing steps={STEP_LABELS} onDone={() => {}} />
        </div>
      )}

      {stage === 'form' && (
        <div className="fade-in">
          <div className="card" style={{ padding: 18, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', background: '#F1F5EC' }}>
            <Wand2 size={18} color="var(--sage-dk)" /><span style={{ fontSize: 13.5 }}>AI detected this as a <b>{d.colorName} {TYPES[d.type].label}</b> with {d.confidence}% confidence. Review and adjust anything below.</span>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <div className="card" style={{ width: 150, height: 170, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#F4F0E6,#ECE6D6)' }}>
              <Garment type={d.type} color={d.color} pattern={d.pattern} fit={d.cut} hanger style={{ width: '82%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="field"><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className="field"><label>Category</label>
                <select value={d.type} onChange={(e) => setD((s) => ({ ...s, type: e.target.value }))}>
                  {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="field"><label>Description <span style={{ fontWeight: 400, color: '#A39E8C' }}>(AI-written, edit freely)</span></label><textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field"><label>Brand</label><select value={d.brand} onChange={(e) => setD((s) => ({ ...s, brand: e.target.value }))}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select></div>
            <div className="field"><label>Department</label><select value={d.dept} onChange={(e) => setD((s) => ({ ...s, dept: e.target.value }))}><option>Women</option><option>Men</option><option>Unisex</option></select></div>
            <div className="field"><label>Size</label><select value={d.size} onChange={(e) => setD((s) => ({ ...s, size: e.target.value }))}>{SIZES_BY_SLOT[slot].map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="field"><label>Fit / cut</label><select value={d.cut} onChange={(e) => setD((s) => ({ ...s, cut: e.target.value }))}>{FITS.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
          </div>

          <div className="field"><label>Condition</label>
            <div className="chip-row">{CONDITIONS.map((c) => <button key={c.id} className={`chip ${d.condition === c.id ? 'active' : ''}`} onClick={() => setD((s) => ({ ...s, condition: c.id }))}>{c.short}</button>)}</div>
          </div>
          <div className="field"><label>Colour</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{SWATCHES.map((hex) => <button key={hex} className={`swatch ${d.color === hex ? 'active' : ''}`} style={{ background: hex }} onClick={() => setD((s) => ({ ...s, color: hex, colorName: nearestColorName(hex) }))} />)}</div>
          </div>
          <div className="field"><label>Pattern</label>
            <div className="chip-row">{PATTERNS.map((p) => <button key={p} className={`chip ${d.pattern === p ? 'active' : ''}`} onClick={() => setD((s) => ({ ...s, pattern: p }))}>{PATTERN_LABEL[p]}</button>)}</div>
          </div>

          <div className="card" style={{ padding: 18, margin: '10px 0 20px', background: '#FBF6E8' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, fontSize: 14, marginBottom: 10 }}><Sparkles size={15} color="var(--gold)" /> AI-suggested price</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} style={{ fontSize: 26, fontWeight: 800, width: 130, border: 'none', background: 'transparent', padding: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Range {inr(priceData.low)}–{inr(priceData.high)} · MRP was {inr(priceData.mrp)}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 8 }}>Based on {priceData.comps.length} similar recent listings. Est. {priceData.days} days to sell · {priceData.demand} demand.</div>
            {priceData.comps.map((c, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderTop: i === 0 ? '1px solid #EBE0C0' : 'none' }}><span>{c.title}</span><span>{inr(c.price)} · sold in {c.days}d</span></div>)}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, marginBottom: 24, cursor: 'pointer' }}>
            <input type="checkbox" checked={swap} onChange={(e) => setSwap(e.target.checked)} /> Open to swaps for this item
          </label>

          <button className="btn btn-primary btn-lg btn-block" onClick={publish}>Publish listing <ArrowRight size={16} /></button>
        </div>
      )}
    </div>
  );
}
