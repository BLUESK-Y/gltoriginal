import { useEffect } from "react";

export default function Modal({ title, sub, onClose, onDownload, children }) {
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="scrim on" onClick={(e) => { if (e.target.classList.contains("scrim")) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            <p>{sub}</p>
          </div>
          <button className="x" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Close</button>
          {onDownload && <button className="btn btn-primary" onClick={onDownload}>Download CSV</button>}
        </div>
      </div>
    </div>
  );
}
