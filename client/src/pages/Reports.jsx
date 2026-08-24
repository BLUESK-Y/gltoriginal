import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getReports, getReport } from "../api.js";
import { fmt, fmtShort } from "../utils/format.js";
import { captures } from "../utils/captures.js";
import Modal from "../components/Modal.jsx";
import Lightbox from "../components/Lightbox.jsx";
import { useToast } from "../ToastContext.jsx";

export default function Reports() {
  const { campaign, hubs } = useOutletContext();
  const [reports, setReports] = useState([]);
  const [openReport, setOpenReport] = useState(null);
  const [photo, setPhoto] = useState(null);
  const toast = useToast();

  useEffect(() => { getReports().then(setReports); }, []);

  async function view(index) {
    const report = await getReport(index);
    setOpenReport({ index, ...report });
  }

  function downloadCsv() {
    if (!openReport) return;
    const header = "Hub ID,Store,Locality,Category,Audit date,Audit time,Latitude,Longitude,Status";
    const rows = openReport.hubs.map((s) =>
      [s.hubId, s.name, s.area, s.category, fmt(s.auditDate), s.auditTime, s.lat.toFixed(4), s.lng.toFixed(4), s.status].join(",")
    );
    const csv = [header, ...rows].join("\n");
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "glt-audit-report.csv";
      a.click();
      URL.revokeObjectURL(a.href);
      toast("Report downloaded");
    } catch (e) {
      toast("Download blocked here — copy from the table above");
    }
  }

  return (
    <section>
      <div className="page-head">
        <div className="eyebrow">Verification</div>
        <h1>Reports</h1>
        <p>A {campaign?.cycleDays}-day campaign generates three milestone reports. Each one is built from the field audits collected in that window.</p>
      </div>

      <div className="reportlist">
        {reports.map((r, i) => (
          <div key={r.n} className={"card report " + r.state}>
            <div className="report-idx">{r.n}</div>
            <div className="report-main">
              <div className="t">{r.title}</div>
              <div className="d">{r.description}{r.state === "live" ? ` Collecting now — ${r.rows} of ${r.maxRows} submitted.` : ""}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--dim)", marginTop: 6 }}>{r.when}</div>
            </div>
            {r.state === "locked"
              ? <span className="pill pill-pending">Locked</span>
              : <button className="btn" onClick={() => view(i)}>{r.state === "live" ? "View draft" : "View report"}</button>}
          </div>
        ))}
      </div>

      {openReport && (
        <Modal
          title={openReport.title}
          sub={`${campaign?.name?.toUpperCase()} · ${campaign?.cycleLabel?.toUpperCase()} · ${openReport.hubs.length} HUBS`}
          onClose={() => setOpenReport(null)}
          onDownload={downloadCsv}
        >
          <div className="tablewrap" style={{ border: 0, borderRadius: 0 }}>
            <table>
              <thead>
                <tr><th>Hub ID</th><th>Store</th><th>Coordinates</th><th>Captured</th><th>Status</th><th>Proof</th></tr>
              </thead>
              <tbody>
                {openReport.hubs.map((s) => (
                  <tr key={s.hubId}>
                    <td className="tdmono">{s.hubId}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td className="tdmono">{s.lat.toFixed(4)}, {s.lng.toFixed(4)}</td>
                    <td className="tdmono">{fmtShort(s.auditDate)} {s.auditTime}</td>
                    <td className="tdmono" style={{ color: "var(--verify)" }}>{s.status}</td>
                    <td>
                      <button className="btn" style={{ height: 26, padding: "0 10px", fontSize: 11 }}
                        onClick={() => { setOpenReport(null); setPhoto({ hubId: s.hubId, ci: captures(s).length - 1 }); }}>
                        View photo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

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
