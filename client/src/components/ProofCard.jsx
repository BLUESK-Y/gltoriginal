import ShelfArt from "./ShelfArt.jsx";
import { fmt, fmtShort, hubNumber } from "../utils/format.js";

export default function ProofCard({ hub, onOpenPhoto }) {
  if (!hub) return null;
  const stamped = hub.status !== "pending";
  const pill =
    hub.status === "verified" ? <span className="pill pill-verify"><i className="dot" />Verified</span>
    : hub.status === "flagged" ? <span className="pill pill-flag"><i className="dot" />Flagged</span>
    : <span className="pill pill-pending"><i className="dot" />Audit pending</span>;

  return (
    <div className="proof">
      <div
        className="proof-img"
        role="button"
        tabIndex={0}
        aria-label={`Open full photo for ${hub.name}`}
        onClick={() => onOpenPhoto?.(hub)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenPhoto?.(hub); } }}
      >
        <span className="zoom">VIEW FULL PHOTO</span>
        <ShelfArt seed={hubNumber(hub.hubId)} />
        {stamped && (
          <div className="stamp">
            LAT {hub.lat.toFixed(4)}° N &nbsp; LNG {hub.lng.toFixed(4)}° E<br />
            {fmt(hub.auditDate).toUpperCase()} · {hub.auditTime} IST &nbsp; {hub.hubId}
          </div>
        )}
      </div>
      <div className="proof-meta">
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="nm">{hub.name}</div>
            <div className="ad">{hub.area}, Trivandrum</div>
          </div>
          {pill}
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="kv"><b>Hub ID</b><span>{hub.hubId}</span></div>
          <div className="kv"><b>Store category</b><span>Cat {hub.category}</span></div>
          <div className="kv"><b>Last audit</b><span>{stamped ? `${fmtShort(hub.auditDate)} · ${hub.auditTime}` : "—"}</span></div>
          <div className="kv"><b>Backlight</b><span style={{ color: hub.status === "pending" ? "var(--muted)" : "var(--verify)" }}>{hub.status === "pending" ? "Not checked" : "Active"}</span></div>
        </div>
        {hub.note && (
          <div style={{ marginTop: 12, padding: "9px 11px", background: "rgba(255,90,71,.08)", border: "1px solid rgba(255,90,71,.25)", borderRadius: 6, fontSize: 12, color: "#FFB3A8" }}>
            {hub.note}
          </div>
        )}
      </div>
    </div>
  );
}
