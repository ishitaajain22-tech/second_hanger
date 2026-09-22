import { conditionMeta } from '../config';
export default function ConditionTag({ condition }) {
  const c = conditionMeta(condition);
  return <span className="tag" style={{ background: c.bg, color: c.fg }}>{c.short}</span>;
}
