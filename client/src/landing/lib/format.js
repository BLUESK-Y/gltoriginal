const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹45,000 — Indian digit grouping, no paise. */
export const inr = (value) =>
  typeof value === 'number' ? inrFormatter.format(value) : '—';
