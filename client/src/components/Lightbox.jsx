import { useEffect, useRef, useState } from "react";
import ShelfArt from "./ShelfArt.jsx";
import { fmt, fmtShort } from "../utils/format.js";
import { captures, stampLines } from "../utils/captures.js";
import { useToast } from "../ToastContext.jsx";

export default function Lightbox({ hubs, hubId, captureIndex = 0, onClose, onNavigate }) {
  const [capIdx, setCapIdx] = useState(captureIndex);
  const stageRef = useRef(null);
  const toast = useToast();

  const hub = hubs.find((h) => h.hubId === hubId);
  const caps = hub ? captures(hub) : [];
  const ci = Math.min(capIdx, Math.max(caps.length - 1, 0));
  const cap = caps[ci];

  useEffect(() => setCapIdx(captureIndex), [hubId, captureIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") stepHub(1);
      if (e.key === "ArrowLeft") stepHub(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubId, hubs]);

  if (!hub || !cap) return null;

  function stepHub(dir) {
    const idx = hubs.findIndex((h) => h.hubId === hubId);
    let j = idx;
    for (let k = 0; k < hubs.length; k++) {
      j = (j + dir + hubs.length) % hubs.length;
      if (captures(hubs[j]).length) { onNavigate(hubs[j].hubId, 0); return; }
    }
  }

  function download() {
    try {
      const svg = stageRef.current.querySelector("svg");
      const xml = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        const W = 1100, H = 825;
        const cv = document.createElement("canvas");
        cv.width = W; cv.height = H;
        const x = cv.getContext("2d");
        x.drawImage(img, 0, 0, W, H);
        const lines = stampLines(hub, cap);
        const fs = 17, lh = fs * 1.6, bh = lh * lines.length + 22;
        x.fillStyle = "rgba(0,0,0,.74)"; x.fillRect(0, H - bh, W, bh);
        x.fillStyle = "rgba(63,217,139,.5)"; x.fillRect(0, H - bh, W, 2);
        x.font = `600 ${fs}px 'JetBrains Mono',monospace`; x.fillStyle = "#3FD98B"; x.textBaseline = "top";
        lines.forEach((l, k) => x.fillText(l, 26, H - bh + 12 + k * lh));
        x.textAlign = "right"; x.fillStyle = "rgba(239,232,27,.9)"; x.font = `700 ${fs}px 'JetBrains Mono',monospace`;
        x.fillText("GLT VERIFIED", W - 26, H - bh + 12);
        const a = document.createElement("a");
        a.href = cv.toDataURL("image/jpeg", 0.85);
        a.download = hub.hubId + "-" + fmtShort(cap.date).replace(" ", "") + ".jpg";
        a.click();
        toast("Photo downloaded");
      };
      img.onerror = () => toast("Download blocked here — right-click the photo to save it");
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    } catch (e) {
      toast("Download blocked here — right-click the photo to save it");
    }
  }

  return (
    <div className="lb on" onClick={(e) => { if (e.target.classList.contains("lb")) onClose(); }}>
      <button className="lbx" aria-label="Close photo" onClick={onClose}>×</button>
      <div className="lb-in">
        <div className="lb-stage" ref={stageRef}>
          <ShelfArt seed={cap.seed} />
          <div className="lb-stamp">
            <span className="gv">GLT VERIFIED</span>
            {stampLines(hub, cap).map((l, i) => <span key={i}>{l}<br /></span>)}
          </div>
        </div>
        <div className="lb-side">
          <h4>{hub.name}</h4>
          <div className="loc">{hub.area}, Trivandrum · Cat {hub.category}</div>
          <div className="eyebrow" style={{ marginBottom: 9 }}>Captures this cycle</div>
          <div className="captabs">
            {caps.map((c, j) => (
              <button key={j} className={"captab" + (j === ci ? " on" : "")} onClick={() => setCapIdx(j)}>
                <div>
                  <div className="cl">{c.label}</div>
                  <div className="cd">{fmtShort(c.date).toUpperCase()} · {c.time}</div>
                </div>
                <div className="cs">✓</div>
              </button>
            ))}
            {hub.status === "pending" && (
              <div className="captab" style={{ opacity: .5 }}>
                <div><div className="cl">Week 1 audit</div><div className="cd">SCHEDULED THIS WEEK</div></div>
              </div>
            )}
          </div>
          <div className="eyebrow" style={{ margin: "16px 0 6px" }}>Verification data</div>
          <div>
            <div className="kv" style={{ borderTop: 0 }}><b>Hub ID</b><span>{hub.hubId}</span></div>
            <div className="kv"><b>Latitude</b><span>{hub.lat.toFixed(5)}° N</span></div>
            <div className="kv"><b>Longitude</b><span>{hub.lng.toFixed(5)}° E</span></div>
            <div className="kv"><b>Captured</b><span>{fmt(cap.date)} · {cap.time}</span></div>
            <div className="kv"><b>Geofence</b><span style={{ color: "var(--verify)" }}>Inside store</span></div>
            <div className="kv"><b>Backlight</b><span style={{ color: "var(--verify)" }}>Active</span></div>
          </div>
          <button className="btn" style={{ width: "100%", marginTop: 14 }} onClick={download}>Download photo</button>
          <div className="lb-nav">
            <button className="btn" onClick={() => stepHub(-1)}>Previous hub</button>
            <button className="btn" onClick={() => stepHub(1)}>Next hub</button>
          </div>
        </div>
      </div>
    </div>
  );
}
