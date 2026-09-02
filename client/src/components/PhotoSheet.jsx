import ShelfArt from "./ShelfArt.jsx";
import { fmtShort, hubNumber } from "../utils/format.js";
import { captures } from "../utils/captures.js";

function fmtTime12(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

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
              <div className="cp"><b>{s.name}</b></div>
            </div>
          );
        }
        const caps = captures(s);
        const c = caps[caps.length - 1];
        return (
          <button key={s.hubId} className="tile" onClick={() => onOpen(s.hubId, caps.length - 1)}>
            <div className="im">
              <ShelfArt seed={c.seed} />
              <span className="hubtag">HUB - {String(hubNumber(s.hubId)).padStart(3, "0")}</span>
              <div className="mini">
                <span>Time - {fmtTime12(c.time)}</span>
                <span>Date - {fmtShort(c.date)}</span>
                <span>Location - {s.area}</span>
              </div>
            </div>
            <div className="cp"><b>{s.name}</b></div>
          </button>
        );
      })}
    </div>
  );
}
