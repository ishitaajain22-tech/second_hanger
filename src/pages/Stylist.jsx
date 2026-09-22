import { useState } from 'react';
import { Link } from 'react-router-dom';
import Garment from '../components/Garment.jsx';
import AIProcessing from '../components/AIProcessing.jsx';
import { Sparkles, Repeat, ShieldCheck, Heart, RefreshCcw } from '../components/icons.jsx';
import { useStore } from '../store.jsx';
import { OCCASIONS, TYPES } from '../data/catalog';
import { generateOutfits } from '../lib/stylist';
import { inr } from '../lib/format';

const VIBES = [['any', 'Balanced'], ['minimal', 'Minimal'], ['streetwear', 'Streetwear'], ['ethnic', 'Ethnic'], ['classic', 'Classic']];
const WEATHER = [['pleasant', '22–28°C'], ['hot', 'Hot & humid'], ['cool', 'Cool / AC']];
const GEN_STEPS = [{ label: 'Reading your wardrobe' }, { label: 'Scanning marketplace for matches' }, { label: 'Balancing colour & silhouette' }, { label: 'Ranking 3 best outfits' }];

export default function Stylist() {
  const { state, products, saveOutfit, unsaveOutfit } = useStore();
  const [occasion, setOccasion] = useState('casual');
  const [vibe, setVibe] = useState('any');
  const [weather, setWeather] = useState('pleasant');
  const [budget, setBudget] = useState(2500);
  const [gen, setGen] = useState(false);
  const [outfits, setOutfits] = useState(null);
  const [seed, setSeed] = useState(1);

  const run = () => { setGen(true); setOutfits(null); };
  const onDone = () => { setOutfits(generateOutfits({ closet: state.wardrobe, market: products, occasion, vibe, weather, budget, meas: state.measurements, seed })); setSeed((s) => s + 1); setGen(false); };
  const shuffle = () => { setOutfits(generateOutfits({ closet: state.wardrobe, market: products, occasion, vibe, weather, budget, meas: state.measurements, seed })); setSeed((s) => s + 1); };

  const sig = (o) => o.items.map((i) => i.key).sort().join('|');
  const isSaved = (o) => state.savedOutfits.some((s) => s.sig === sig(o));

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <div className="eyebrow"><Sparkles size={13} /> AI Outfit Stylist</div>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>What should I wear?</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28, maxWidth: 560 }}>Combines pieces from your digital closet with marketplace finds that fit your measurements, so every outfit is ready to actually wear.</p>

      <div className="card" style={{ padding: 22, marginBottom: 28 }}>
        <div className="field"><label>Occasion</label>
          <div className="chip-row">{Object.entries(OCCASIONS).map(([k, v]) => <button key={k} className={`chip ${occasion === k ? 'active' : ''}`} onClick={() => setOccasion(k)}>{v.label}</button>)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field"><label>Vibe</label><div className="chip-row">{VIBES.map(([k, l]) => <button key={k} className={`chip ${vibe === k ? 'active' : ''}`} onClick={() => setVibe(k)}>{l}</button>)}</div></div>
          <div className="field"><label>Weather</label><div className="chip-row">{WEATHER.map(([k, l]) => <button key={k} className={`chip ${weather === k ? 'active' : ''}`} onClick={() => setWeather(k)}>{l}</button>)}</div></div>
        </div>
        <div className="field"><label>Max spend on marketplace picks · ₹{budget}</label><input type="range" min="0" max="6000" step="100" value={budget} onChange={(e) => setBudget(+e.target.value)} /></div>
        <button className="btn btn-primary btn-lg" onClick={run}><Sparkles size={16} /> Generate outfits</button>
      </div>

      {gen && <div className="card" style={{ padding: 20, marginBottom: 24 }}><AIProcessing steps={GEN_STEPS} onDone={onDone} /></div>}

      {outfits && (
        <div>
          <div className="section-head"><h2 style={{ fontSize: 24 }}>Your outfits for {OCCASIONS[occasion].label.toLowerCase()}</h2><button className="btn btn-ghost" onClick={shuffle}><RefreshCcw size={14} /> Shuffle</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {outfits.map((o) => (
              <div key={o.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <b style={{ fontSize: 15 }}>{o.name}</b>
                  <span className="pill" style={{ background: 'var(--lime)', color: 'var(--lime-ink)' }}>{o.score}% match</span>
                </div>
                <div style={{ display: 'flex', gap: 8, background: '#F4F0E6', borderRadius: 12, padding: 12, marginBottom: 12, overflowX: 'auto' }}>
                  {o.items.map((it) => (
                    it.src === 'market' ? <Link key={it.key} to={`/product/${it.id}`} style={{ flex: 'none' }}><Garment type={it.type} color={it.color} pattern={it.pattern} fit={it.cut} style={{ width: 62, height: 72 }} /></Link>
                    : <div key={it.key} style={{ flex: 'none' }}><Garment type={it.type} color={it.color} pattern={it.pattern} fit={it.cut} style={{ width: 62, height: 72 }} /></div>
                  ))}
                </div>
                <ul style={{ margin: '0 0 12px', paddingLeft: 18, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{o.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
                {o.cost > 0 && <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Adds {inr(o.cost)} in new pieces</div>}
                <button className="btn btn-outline btn-sm btn-block" onClick={() => isSaved(o) ? unsaveOutfit(sig(o)) : saveOutfit({ ...o, sig: sig(o) })}><Heart size={13} fill={isSaved(o) ? 'currentColor' : 'none'} /> {isSaved(o) ? 'Saved' : 'Save outfit'}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!outfits && !gen && (
        <div className="empty"><Sparkles size={28} style={{ marginBottom: 10, opacity: .5 }} /><p>Set your preferences above and hit generate to see AI-styled outfits.</p></div>
      )}
    </div>
  );
}
