import { fmtShort } from "../utils/format.js";

export default function HubsTable({ hubs, onSelect }) {
  if (!hubs.length) {
    return (
      <div className="tablewrap">
        <table><tbody><tr><td>
          <div className="empty"><b>No hubs match that</b>Try a different locality, or clear the filters.</div>
        </td></tr></tbody></table>
      </div>
    );
  }

  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr><th>Hub ID</th><th>Store</th><th>Locality</th><th>Cat</th><th>Last audit</th><th>Status</th></tr>
        </thead>
        <tbody>
          {hubs.map((s) => {
            const pill = s.status === "verified" ? <span className="pill pill-verify"><i className="dot" />Verified</span>
              : s.status === "flagged" ? <span className="pill pill-flag"><i className="dot" />Flagged</span>
              : <span className="pill pill-pending"><i className="dot" />Pending</span>;
            return (
              <tr key={s.hubId} onClick={() => onSelect(s.hubId)}>
                <td className="tdmono">{s.hubId}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ color: "var(--muted)" }}>{s.area}</td>
                <td className="tdmono">{s.category}</td>
                <td className="tdmono">{s.status === "pending" ? "—" : `${fmtShort(s.auditDate)} · ${s.auditTime}`}</td>
                <td>{pill}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
