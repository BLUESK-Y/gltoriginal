/**
 * Rate card and coverage. Single source of truth — the client renders
 * whatever this returns and never computes a billable total itself.
 */

export const RATE_CARD = {
  currency: 'INR',
  minHubs: 5,
  hubStep: 5,
  gstNote: 'GST extra.',
  // Per store, per day. Two booking cycles only — a 15-day block or a
  // full month at the better per-day rate.
  durations: [
    {
      id: 'first15',
      days: 15,
      label: '15 days',
      ratePerDay: 100,
      ratePerHub: 100 * 15,
      reports: 3,
      description: 'Standard rate for a fresh campaign.',
    },
    {
      id: 'month',
      days: 30,
      label: 'Whole month',
      ratePerDay: 75,
      ratePerHub: 75 * 30,
      reports: 5,
      description: 'Best per-day rate, booked as one continuous cycle.',
    },
  ],
  // Current network is Category B neighbourhood supermarkets only — no
  // premium tier is quoted here until Cat A inventory is actually live.
  storeMix: [
    {
      id: 'catB',
      label: 'Category B supermarkets',
      surchargePct: 0,
      description: 'Neighbourhood retail — our current network.',
    },
  ],
  advancePct: 50,
  installFeePerHub: 100,
  includes: ['Weekly geo-stamped photo audit', 'Live client dashboard', 'Exclusive panel — no rotation'],
};

/** Coverage tree used by the state → city selector in the campaign builder. */
export const REGIONS = [
  {
    state: 'Kerala',
    cities: [
      {
        city: 'Thiruvananthapuram',
        status: 'live',
        availableHubs: 50,
        note: 'Kazhakkoottam to Neyyattinkara. Booking open now.',
      },
      { city: 'Kollam', status: 'waitlist', availableHubs: 0, note: 'Phase 2 — 2027.' },
      { city: 'Kochi', status: 'waitlist', availableHubs: 0, note: 'Phase 2 — 2027.' },
      { city: 'Thrissur', status: 'waitlist', availableHubs: 0, note: 'Phase 2 — 2027.' },
      { city: 'Kozhikode', status: 'waitlist', availableHubs: 0, note: 'Phase 2 — 2027.' },
    ],
  },
  {
    state: 'Tamil Nadu',
    cities: [
      { city: 'Chennai', status: 'waitlist', availableHubs: 0, note: 'Phase 3 — 2028.' },
      { city: 'Coimbatore', status: 'waitlist', availableHubs: 0, note: 'Phase 3 — 2028.' },
    ],
  },
  {
    state: 'Karnataka',
    cities: [
      { city: 'Bengaluru', status: 'waitlist', availableHubs: 0, note: 'Phase 3 — 2028.' },
    ],
  },
];

export function findCity(state, city) {
  return REGIONS.find((r) => r.state === state)?.cities.find((c) => c.city === city) ?? null;
}

/**
 * Aggregate coverage across a chosen set of cities within one state — for
 * city-wise targeting that spans more than one city. Returns null if any
 * requested city isn't part of that state's coverage.
 */
export function findCities(state, cityNames) {
  const region = REGIONS.find((r) => r.state === state);
  if (!region || !cityNames.length) return null;

  const matches = cityNames.map((name) => region.cities.find((c) => c.city === name));
  if (matches.some((c) => !c)) return null;

  const liveCities = matches.filter((c) => c.status === 'live');
  const availableHubs = liveCities.reduce((sum, c) => sum + c.availableHubs, 0);

  return {
    cities: matches.map((c) => c.city),
    status: liveCities.length ? 'live' : 'waitlist',
    availableHubs,
  };
}

/**
 * Aggregate coverage for an entire state — for the "whole state" campaign
 * option, which sums hubs across every live city rather than pinning the
 * booking to one.
 */
export function findState(state) {
  const region = REGIONS.find((r) => r.state === state);
  if (!region) return null;

  const liveCities = region.cities.filter((c) => c.status === 'live');
  const availableHubs = liveCities.reduce((sum, c) => sum + c.availableHubs, 0);

  return {
    state: region.state,
    status: liveCities.length ? 'live' : 'waitlist',
    availableHubs,
    liveCities: liveCities.map((c) => c.city),
  };
}

/**
 * Server-side quote. Returns the same shape the campaign builder renders,
 * so a tampered client can never change what gets quoted.
 */
export function quote({ hubs, duration, storeMix }) {
  const durationSpec = RATE_CARD.durations.find((d) => d.id === String(duration));
  const mixSpec = RATE_CARD.storeMix.find((m) => m.id === storeMix);
  if (!durationSpec || !mixSpec) return null;

  const base = hubs * durationSpec.ratePerHub;
  const surcharge = Math.round((base * mixSpec.surchargePct) / 100);
  const campaignTotal = base + surcharge;
  // One-time printing/install fee, paid upfront alongside the advance —
  // separate from the per-day campaign rate, not split across the cycle.
  const installFee = hubs * RATE_CARD.installFeePerHub;
  const advance = Math.round((campaignTotal * RATE_CARD.advancePct) / 100);
  const balance = campaignTotal - advance;

  return {
    currency: RATE_CARD.currency,
    hubs,
    panels: hubs * 2,
    days: durationSpec.days,
    ratePerDay: durationSpec.ratePerDay,
    ratePerHub: durationSpec.ratePerHub,
    reports: durationSpec.reports,
    base,
    surchargePct: mixSpec.surchargePct,
    surcharge,
    campaignTotal,
    installFee,
    total: campaignTotal + installFee,
    advancePct: RATE_CARD.advancePct,
    advance,
    balance,
    includes: RATE_CARD.includes,
    gstNote: RATE_CARD.gstNote,
  };
}
