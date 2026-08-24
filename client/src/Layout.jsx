import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCampaign, getHubs, getTickets } from "./api.js";
import { clearClient } from "./auth.js";
import { fmtShort } from "./utils/format.js";

export default function Layout() {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [hubs, setHubs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedHubId, setSelectedHubId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  const refreshCampaign = useCallback(() => getCampaign().then(setCampaign), []);
  const refreshHubs = useCallback(() => getHubs().then(setHubs), []);
  const refreshTickets = useCallback(() => getTickets().then(setTickets), []);

  useEffect(() => {
    Promise.all([refreshCampaign(), refreshHubs(), refreshTickets()])
      .catch((err) => console.error("Failed to load portal data", err))
      .finally(() => setLoading(false));
  }, [refreshCampaign, refreshHubs, refreshTickets]);

  useEffect(() => {
    if (hubs.length && !selectedHubId) setSelectedHubId(hubs[0].hubId);
  }, [hubs, selectedHubId]);

  const ctx = {
    campaign, hubs, tickets, selectedHubId, setSelectedHubId,
    refreshCampaign, refreshHubs, refreshTickets
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        Loading campaign data…
      </div>
    );
  }

  const day = campaign?.currentDay ?? 0;
  const cycleDays = campaign?.cycleDays ?? 15;
  const stats = campaign?.stats || {};

  return (
    <div id="app">
      <header className="topbar">
        <button
          type="button"
          className="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
        <img src="/assets/glt-logo-dashboard.png" alt="Ground Link Technology" className="wordmark-logo" />
        <div className="topbar-div" />
        <div className="campaign-name">
          {campaign?.name} — {campaign?.cycleLabel}
          <small>Active campaign</small>
        </div>
        <div className="brand-chip">
          <div className="avatar">
            {(campaign?.client || "??").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{campaign?.client}</div>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ height: 32, padding: "0 12px", fontSize: 12, color: "var(--dim)" }}
          onClick={() => {
            clearClient();
            navigate("/");
          }}
        >
          Log out
        </button>
      </header>

      <div className="shell">
        <nav className={"rail" + (navOpen ? " open" : "")}>
          <div className="eyebrow">Campaign</div>
          <NavItem to="/dashboard" end label="Overview" count={hubs.length} onClick={() => setNavOpen(false)} />
          <NavItem to="/dashboard/reports" label="Reports" count={3} onClick={() => setNavOpen(false)} />
          <NavItem to="/dashboard/lifecycle" label="Booking & payments" onClick={() => setNavOpen(false)} />
          <div className="eyebrow" style={{ marginTop: 18 }}>Support</div>
          <NavItem to="/dashboard/concerns" label="Concerns" count={tickets.length} onClick={() => setNavOpen(false)} />
        </nav>

        <main className="main">
          <div className="ribbon">
            <div className="ribbon-stat">
              <div className="eyebrow">Hubs live</div>
              <b className="v">{stats.hubsTotal ?? 0} / {stats.hubsTotal ?? 0}</b>
            </div>
            <div className="ribbon-stat">
              <div className="eyebrow">Verified this week</div>
              <b className="v">{stats.verified ?? 0}</b>
            </div>
            <div className="ribbon-stat">
              <div className="eyebrow">Cycle</div>
              <b className="v">Days 1–{cycleDays}</b>
            </div>
            <div className="ribbon-track">
              <div className="eyebrow">Campaign day <span className="mono">{day} of {cycleDays}</span></div>
              <div className="track"><i style={{ width: (day / cycleDays * 100) + "%" }} /></div>
              <div className="track-marks">
                <span>{campaign ? fmtShort(campaign.cycleStart) : ""}</span>
                <span>Week 1 audit · D7</span>
                <span>Week 2 audit · D14</span>
                <span>{campaign ? fmtShort(campaign.cycleEnd) : ""}</span>
              </div>
            </div>
          </div>

          <Outlet context={ctx} />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, end, label, count, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) => "nav-item" + (isActive ? " on" : "")}>
      <i className="nav-tick" />{label}
      {count !== undefined && <span className="nav-count">{count}</span>}
    </NavLink>
  );
}
