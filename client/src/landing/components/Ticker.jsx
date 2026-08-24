const ITEMS = ['Point of purchase advertising', 'Guaranteed visibility', 'Better ROI', 'Verified tracking'];

export function Ticker() {
  return (
    <div className="overflow-hidden border-t border-b border-rule bg-ink py-6">
      <div className="marquee flex gap-16 whitespace-nowrap motion-reduce:animate-none">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="shrink-0 text-[13px] font-semibold tracking-[0.15em] text-white/70 uppercase">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
