import { useOutletContext } from "react-router-dom";
import { useToast } from "../ToastContext.jsx";
import { fmt } from "../utils/format.js";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Lifecycle() {
  const { campaign } = useOutletContext();
  const toast = useToast();
  if (!campaign) return null;
  const { rate, milestones } = campaign;

  return (
    <section>
      <div className="page-head">
        <div className="eyebrow">Campaign</div>
        <h1>Booking &amp; payments</h1>
        <p>Where this campaign stands against the agreed milestones.</p>
      </div>
      <div className="split">
        <div className="card">
          <div className="panel-head"><h3>Milestones</h3></div>
          <div className="panel-body">
            <div className="flow">
              {milestones.map((f, i) => (
                <div key={i} className={"step " + f.state}>
                  <div className="step-node"><i /></div>
                  <div className="t">{f.title}</div>
                  <div className="d">{f.detail}</div>
                  <div className="when">{f.when}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card" style={{ alignSelf: "start" }}>
          <div className="panel-head"><h3>Payment summary</h3></div>
          <div className="panel-body">
            <div className="kv" style={{ borderTop: 0 }}><b>Hubs booked</b><span>{rate.hubs} × {rate.days} days</span></div>
            <div className="kv"><b>Rate per hub / cycle</b><span>{inr(rate.perHubPerCycle)}</span></div>
            <div className="kv"><b>Campaign value</b><span>{inr(rate.total)}</span></div>
            <div className="kv"><b>Advance paid · {fmt(rate.advancePaidOn)}</b><span style={{ color: "var(--verify)" }}>{inr(rate.advancePaid)}</span></div>
            <div className="kv"><b>Balance due</b><span style={{ color: "var(--signal)" }}>{inr(rate.balanceDue)}</span></div>
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}
              onClick={() => toast("Payment gateway opens here in the live build")}>
              Pay balance {inr(rate.balanceDue)}
            </button>
            <p style={{ color: "var(--dim)", fontSize: 11.5, margin: "10px 0 0" }}>
              Balance is released against the installation proof report. Print and GST invoices are attached to each payment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
