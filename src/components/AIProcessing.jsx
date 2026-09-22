import { useEffect, useState } from 'react';
import { runSteps } from '../lib/ai';
import { Sparkles, Check } from './icons.jsx';

/** Shows a sequence of "AI is thinking" steps, then calls onDone. Purely simulated. */
export default function AIProcessing({ steps, onDone, compact = false }) {
  const [i, setI] = useState(0);
  useEffect(() => { runSteps(steps, setI).then(() => setTimeout(onDone, 350)); /* eslint-disable-next-line */ }, []);
  return (
    <div className={compact ? '' : 'loading-block'}>
      {!compact && (
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={26} className="spinner" style={{ color: 'var(--lime-ink)', animationDuration: '2.2s' }} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, alignItems: compact ? 'flex-start' : 'center' }}>
        {steps.map((s, idx) => (
          <div key={idx} className={`step-line ${idx === i ? 'active' : idx < i ? 'done' : ''}`}>
            {idx < i ? <Check size={14} /> : idx === i ? <span className="spinner" /> : <span style={{ width: 14 }} />}
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
