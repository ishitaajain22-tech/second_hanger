import { useStore } from '../store.jsx';
import { CheckCircle2, AlertCircle } from './icons.jsx';
export default function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast fade-in ${t.kind === 'warn' ? 'warn' : ''}`}>
          {t.kind === 'warn' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
          {t.text}
        </div>
      ))}
    </div>
  );
}
