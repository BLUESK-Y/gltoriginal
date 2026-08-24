import { useEffect, useRef } from 'react';

export function Modal({ open, onClose, labelId, title, subtitle, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const firstField = panelRef.current?.querySelector('input, select, textarea, button');
    firstField?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-6">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="relative my-8 w-full max-w-lg border border-rule bg-white p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 text-2xl leading-none text-muted transition-colors hover:text-ink"
        >
          &times;
        </button>

        <h2 id={labelId} className="pr-8 text-2xl font-bold tracking-[-0.5px] text-ink uppercase">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
