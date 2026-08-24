import ShelfArt from "./ShelfArt.jsx";
import { fmtShort } from "../utils/format.js";
import { captures } from "../utils/captures.js";

export default function PhotoSheet({ hubs, onOpen }) {
  if (!hubs.length) {
    return <div className="empty" style={{ gridColumn: "1/-1" }}><b>No photos match that</b>Try a different locality, or clear the filters.</div>;
  }

  return (
    <div className="sheet">
      {hubs.map((s) => {
        if (s.status === "pending") {
          return (
            <div key={s.hubId} className="tile none">
              <div className="im" />
              <div className="cp"><b>{s.name}</b><span>{s.hubId} · {s.area.toUpperCase()}</span></div>
            </div>
          );
        }
        const caps = captures(s);
        const c = caps[caps.length - 1];
        return (
          <button key={s.hubId} className="tile" onClick={() => onOpen(s.hubId, caps.length - 1)}>
            <div className="im">
              <ShelfArt seed={c.seed} />
              <div className="mini">LAT {s.lat.toFixed(4)} · LNG {s.lng.toFixed(4)}<br />{fmtShort(c.date).toUpperCase()} · {c.time}</div>
            </div>
            <div className="cp"><b>{s.name}</b><span>{caps.length} CAPTURE{caps.length > 1 ? "S" : ""} · {s.area.toUpperCase()}</span></div>
          </button>
        );
      })}
    </div>
  );
}
