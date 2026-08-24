export function fmt(dateLike) {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtShort(dateLike) {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function hubNumber(hubId) {
  return parseInt(hubId.slice(-3), 10);
}
