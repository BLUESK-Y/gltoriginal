import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MapView from "../components/MapView.jsx";
import HubsTable from "../components/HubsTable.jsx";
import PhotoSheet from "../components/PhotoSheet.jsx";
import ProofCard from "../components/ProofCard.jsx";
import Lightbox from "../components/Lightbox.jsx";

const FILTERS = [
  { f: "all", label: "All" },
  { f: "verified", label: "Verified" },
  { f: "pending", label: "Pending" },
  { f: "A", label: "Cat A" },
  { f: "B", label: "Cat B" }
];

export default function Overview() {
  const { hubs, selectedHubId, setSelectedHubId } = useOutletContext();
  const [view, setView] = useState("map");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [photo, setPhoto] = useState(null);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    return hubs.filter((s) => {
      const okF = filter === "all" || filter === s.status || filter === s.category;
      const okQ = !query || (s.name + " " + s.area + " " + s.hubId).toLowerCase().includes(query);
      return okF && okQ;
    });
  }, [hubs, filter, q]);

  const selected = hubs.find((h) => h.hubId === selectedHubId);

  function selectAndShowMap(hubId) {
    setSelectedHubId(hubId);
    setView("map");
  }

  return (
    <section>
      <div className="page-head">
        <div className="eyebrow">Deployment</div>
        <h1>Network</h1>
        <p>All {hubs.length} hubs carrying your creative this cycle, with the coordinates and timestamp captured at each audit.</p>
      </div>

      <div className="toolbar">
        <div className="viewtoggle">
          {["map", "list", "photos"].map((v) => (
            <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <input className="field" placeholder="Search store or locality" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chipbar">
          {FILTERS.map((c) => (
            <button key={c.f} className={"chip" + (filter === c.f ? " on" : "")} onClick={() => setFilter(c.f)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {view === "map" && (
        <div className="maprow">
          <MapView hubs={hubs} selectedHubId={selectedHubId} onSelect={setSelectedHubId} />
          <div className="card" style={{ alignSelf: "start" }}>
            <div className="panel-head"><h3>Store inspection</h3></div>
            <div className="panel-body">
              <ProofCard hub={selected} onOpenPhoto={(h) => setPhoto({ hubId: h.hubId, ci: 0 })} />
            </div>
          </div>
        </div>
      )}

      {view === "photos" && (
        <div>
          <p style={{ color: "var(--muted)", fontSize: "12.5px", margin: "0 0 16px" }}>
            Every audit photo taken this cycle. Click any one to open it full size with its coordinates and timestamp.
          </p>
          <PhotoSheet hubs={filtered} onOpen={(hubId, ci) => setPhoto({ hubId, ci })} />
        </div>
      )}

      {view === "list" && <HubsTable hubs={filtered} onSelect={selectAndShowMap} />}

      {photo && (
        <Lightbox
          hubs={hubs}
          hubId={photo.hubId}
          captureIndex={photo.ci}
          onNavigate={(hubId, ci) => setPhoto({ hubId, ci })}
          onClose={() => setPhoto(null)}
        />
      )}
    </section>
  );
}
