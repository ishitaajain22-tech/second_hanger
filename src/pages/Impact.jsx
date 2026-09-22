import { useMemo } from 'react';
import { useStore } from '../store.jsx';
import { impactSummary } from '../lib/impact';
import { Leaf, Droplets, Recycle, TrendingUp, Award } from '../components/icons.jsx';
import { inr } from '../lib/format';
import { TYPES } from '../data/catalog';
import { LEVELS } from '../lib/impact';

export default function Impact() {
  const { state } = useStore();
  const s = useMemo(() => impactSummary(state), [state]);
  const maxType = Math.max(1, ...Object.values(s.byType));

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <div className="eyebrow"><Leaf size={13} /> Sustainability dashboard</div>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Your impact so far</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>Every buy, sell and swap keeps a garment in use longer. Here is what that adds up to.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 30 }}>
        <Stat icon={Leaf} v={`${s.co2} kg`} l="CO₂e avoided" sub={`≈ ${s.km} km not driven`} />
        <Stat icon={Droplets} v={`${s.water.toLocaleString('en-IN')} L`} l="Water saved" sub={`≈ ${s.showers} showers`} />
        <Stat icon={Recycle} v={`${s.waste} kg`} l="Textile waste diverted" sub="from landfill" />
        <Stat icon={TrendingUp} v={inr(s.saved)} l="Saved buying pre-loved" sub="vs retail price" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 34 }}>{s.level.emoji}</div>
            <div><div style={{ fontWeight: 800, fontSize: 19 }}>{s.level.name}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{s.count} items kept in circulation</div></div>
          </div>
          {s.next && (
            <>
              <div className="progress-track" style={{ marginBottom: 6 }}><div className="progress-fill" style={{ width: `${Math.min(100, (s.count / s.next.min) * 100)}%` }} /></div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{s.next.min - s.count} more to reach <b>{s.next.name}</b> {s.next.emoji}</div>
            </>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {LEVELS.map((l) => <span key={l.name} className="pill" style={{ opacity: l.min <= s.count ? 1 : .35, background: l.min <= s.count ? 'var(--lime)' : '#F1ECE0', color: l.min <= s.count ? 'var(--lime-ink)' : 'var(--ink-soft)' }}>{l.emoji} {l.name}</span>)}
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>Activity breakdown</div>
          {[['Bought pre-loved', s.byKind.bought, 'var(--sage)'], ['Sold', s.byKind.sold, 'var(--clay)'], ['Swapped', s.byKind.swapped, 'var(--gold)']].map(([l, v, c]) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{l}</span><span>{v}</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${(v / Math.max(1, s.count)) * 100}%`, background: c }} /></div>
            </div>
          ))}
          <div className="hr" style={{ margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}><span>Total lifetime earnings</span><span>{inr(s.earned)}</span></div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 16 }}>CO₂e avoided by category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(s.byType).sort((a, b) => b[1] - a[1]).map(([t, v]) => (
            <div key={t} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 50px', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12.5, textTransform: 'capitalize' }}>{TYPES[t]?.label || t}</span>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${(v / maxType) * 100}%` }} /></div>
              <span style={{ fontSize: 12, textAlign: 'right', color: 'var(--ink-soft)' }}>{Math.round(v)}kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Stat({ icon: Icon, v, l, sub }) {
  return <div className="card" style={{ padding: 20 }}><Icon size={18} color="var(--sage-dk)" /><div style={{ fontFamily: 'var(--serif)', fontSize: 26, margin: '8px 0 2px' }}>{v}</div><div style={{ fontSize: 12.5, fontWeight: 700 }}>{l}</div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{sub}</div></div>;
}
