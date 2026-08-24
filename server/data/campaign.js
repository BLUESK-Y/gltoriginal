// Static demo campaign metadata (booking/payment milestones, cycle dates).
// This isn't hub-derived, so it lives as config rather than a DB collection for now.

export const CAMPAIGN = {
  name: "FlashPop Crunch",
  cycleLabel: "Trivandrum Cycle 3",
  client: "FlashPop Foods",
  cycleStart: "2026-08-03",
  cycleEnd: "2026-08-17",
  cycleDays: 15,
  currentDay: 8,
  rate: {
    hubs: 50,
    days: 15,
    perHubPerCycle: 1800,
    total: 90000,
    advancePaid: 45000,
    advancePaidOn: "2026-07-30",
    balanceDue: 45000
  },
  milestones: [
    { title: "Inventory booked", detail: "50 hubs held across Cat A and Cat B stores.", when: "28 Jul 2026", state: "done" },
    { title: "Advance paid and contract signed", detail: "₹45,000 received. Campaign confirmed.", when: "30 Jul 2026", state: "done" },
    { title: "Print proof approved", detail: "Translit artwork signed off by your team.", when: "01 Aug 2026", state: "done" },
    { title: "Printing and installation", detail: "All 50 hubs fitted by the field team.", when: "03 Aug 2026", state: "done" },
    { title: "Installation proof released", detail: "Report 01 published to this portal.", when: "03 Aug 2026", state: "done" },
    { title: "Balance payment due", detail: "₹45,000 payable against installation proof.", when: "Due now", state: "live" },
    { title: "Week 1 audit report", detail: "Field audits in progress — 43 of 50 submitted.", when: "Closes 10 Aug 2026", state: "live" },
    { title: "Week 2 audit and closure", detail: "Final verification and removal confirmation.", when: "17 Aug 2026", state: "todo" }
  ]
};

export const REPORT_DEFS = [
  {
    n: "01",
    title: "Pre-campaign installation report",
    description: "Photo proof that all 50 hubs carry your creative, captured at installation.",
    when: "Released 03 Aug 2026",
    state: "ready",
    includeStatuses: ["verified", "pending", "flagged"],
    maxRows: 50
  },
  {
    n: "02",
    title: "Week 1 mid-campaign audit",
    description: "Weekly re-verification of every hub.",
    when: "Closes 10 Aug 2026",
    state: "live",
    includeStatuses: ["verified", "flagged"],
    maxRows: 43
  },
  {
    n: "03",
    title: "Week 2 campaign closure report",
    description: "Final audit plus removal confirmation. Unlocks on day 14.",
    when: "Expected 17 Aug 2026",
    state: "locked",
    includeStatuses: [],
    maxRows: 0
  }
];
