import { hubNumber } from "./format.js";

const INSTALL_DATE = "2026-08-03";

export function captures(hub) {
  const n = hubNumber(hub.hubId);
  const list = [{
    label: "Installation proof",
    date: INSTALL_DATE,
    time: String(9 + (n % 7)).padStart(2, "0") + ":" + String((n * 13) % 60).padStart(2, "0"),
    seed: n
  }];
  if (hub.status !== "pending") {
    list.push({ label: "Week 1 audit", date: hub.auditDate, time: hub.auditTime, seed: n + 37 });
  }
  return list;
}

export function stampLines(hub, capture) {
  const auditorNum = (hubNumber(hub.hubId) % 4) + 1;
  return [
    `LAT ${hub.lat.toFixed(5)}° N   LNG ${hub.lng.toFixed(5)}° E`,
    `${new Date(capture.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()} · ${capture.time} IST`,
    `${hub.hubId}   ${hub.name.toUpperCase()}   AUDITOR FE-TVM-0${auditorNum}`
  ];
}
