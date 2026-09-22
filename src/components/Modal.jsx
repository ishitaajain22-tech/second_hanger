import { useEffect } from 'react';
import { X } from './icons.jsx';
export default function Modal({ onClose, children, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 0' }}>
            <h3 style={{ fontSize: 22 }}>{title}</h3>
            <button className="icon-btn" onClick={onClose}><X size={17} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
