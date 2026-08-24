import { Modal } from './Modal';

export function StoreListModal({ open, onClose, title, subtitle, hubs }) {
  return (
    <Modal open={open} onClose={onClose} labelId="store-list-title" title={title} subtitle={subtitle}>
      {hubs.length === 0 ? (
        <div className="border border-rule bg-paper p-6 text-center">
          <p className="text-sm font-semibold text-ink">No live hubs here yet.</p>
          <p className="mt-1 text-[13px] text-muted">This area is on the waitlist for a future phase.</p>
        </div>
      ) : (
        <ul className="max-h-[60vh] divide-y divide-rule overflow-y-auto border border-rule">
          {hubs.map((hub) => (
            <li key={hub.hubId} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-[14px] font-bold text-ink">{hub.storeName}</p>
                <p className="text-[12.5px] text-muted">{hub.locality}</p>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-[11px] tracking-[0.04em] text-label uppercase">
                  Cat {hub.category} · {hub.panels ?? 2} panels
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.06em] uppercase ${
                    hub.status === 'live' ? 'text-ink' : 'text-muted'
                  }`}
                >
                  <span className={hub.status === 'live' ? 'size-1.5 rounded-full bg-ink' : 'size-1.5 rounded-full border border-muted'} />
                  {hub.status === 'live' ? 'Live' : 'Network'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
