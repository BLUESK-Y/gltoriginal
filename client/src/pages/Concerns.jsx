import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { createTicket, clearTickets } from "../api.js";
import { useToast } from "../ToastContext.jsx";
import { fmt } from "../utils/format.js";

const TYPES = [
  "Display obstructed by stock",
  "Poster damaged or peeling",
  "Backlight not working",
  "Wrong creative installed",
  "Hub moved from agreed position",
  "Something else"
];

export default function Concerns() {
  const { hubs, tickets, refreshTickets, refreshCampaign } = useOutletContext();
  const toast = useToast();
  const [hubId, setHubId] = useState(hubs[0]?.hubId || "");
  const [type, setType] = useState(TYPES[0]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const hub = hubs.find((h) => h.hubId === hubId);
    if (!hub) return;
    setSubmitting(true);
    try {
      const t = await createTicket({ hubId: hub.hubId, hubName: `${hub.name} — ${hub.area}`, type, note });
      setNote("");
      await Promise.all([refreshTickets(), refreshCampaign()]);
      toast("Ticket " + t.ticketId + " opened");
    } finally {
      setSubmitting(false);
    }
  }

  async function clearAll() {
    await clearTickets();
    await Promise.all([refreshTickets(), refreshCampaign()]);
  }

  return (
    <section>
      <div className="page-head">
        <div className="eyebrow">Support</div>
        <h1>Concerns</h1>
        <p>Flag anything that looks wrong at a hub — an obstructed display, a damaged poster, a backlight that's off. It opens a ticket with the operations team, and you'll see it tracked here until it's closed.</p>
      </div>
      <div className="split">
        <div className="card">
          <div className="panel-head"><h3>Raise a concern</h3></div>
          <div className="panel-body">
            <div style={{ marginBottom: 14 }}>
              <label className="lbl" htmlFor="c-store">Hub</label>
              <select className="field" id="c-store" value={hubId} onChange={(e) => setHubId(e.target.value)}>
                {hubs.map((h) => <option key={h.hubId} value={h.hubId}>{h.name} — {h.area}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="lbl" htmlFor="c-type">What's wrong</label>
              <select className="field" id="c-type" value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="lbl" htmlFor="c-note">Details</label>
              <textarea className="field" id="c-note" placeholder="What did you see, and when?"
                value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={submitting} onClick={submit}>
              Open ticket
            </button>
          </div>
        </div>
        <div className="card" style={{ alignSelf: "start" }}>
          <div className="panel-head">
            <h3>Your tickets</h3>
            <button className="btn btn-ghost" style={{ height: 26, padding: "0 10px", fontSize: 11.5, color: "var(--dim)" }} onClick={clearAll}>
              Clear all
            </button>
          </div>
          <div className="panel-body">
            {!tickets.length
              ? <div className="empty"><b>No open tickets</b>Anything you flag will show here with its response status.</div>
              : tickets.map((t) => (
                <div key={t.ticketId} style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 11, color: "var(--signal)" }}>{t.ticketId}</span>
                    <span className="pill pill-pending" style={{ marginLeft: "auto" }}><i className="dot" />{t.state}</span>
                  </div>
                  <div style={{ fontWeight: 600, marginTop: 6, fontSize: 13 }}>{t.type}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 3 }}>{t.hubName}</div>
                  {t.note && <div style={{ color: "var(--dim)", fontSize: 12, marginTop: 6 }}>{t.note}</div>}
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--dim)", marginTop: 6 }}>
                    Raised {fmt(t.createdAt)} · response within 24h
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
