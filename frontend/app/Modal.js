// Modal.js
'use client';
import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, children }) {
  const overlayRef = useRef();
  const cardRef = useRef();

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    // focus the dialog for accessibility
    setTimeout(() => cardRef.current?.focus(), 50);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
    >
      <div className="dialog-card" ref={cardRef} tabIndex={-1}>
        <button aria-label="Cerrar" className="dialog-close" onClick={onClose}>✕</button>
        <div className="dialog-body">{children}</div>
        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
