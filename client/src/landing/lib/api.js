// Dev goes through the Vite proxy, production is same-origin. VITE_API_URL
// overrides both when the API is deployed somewhere else.
const BASE = import.meta.env.VITE_API_URL ?? '/api/site';

export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields ?? {};
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.');
  }

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(payload.error ?? `Request failed (${res.status})`, {
      status: res.status,
      fields: payload.fields,
    });
  }

  return payload;
}

export const getHubs = () => request('/hubs');
export const getPricingConfig = () => request('/pricing/config');

export const getQuote = (body, { signal } = {}) =>
  request('/pricing/quote', { method: 'POST', body: JSON.stringify(body), signal });

export const submitLead = (body) =>
  request('/leads', { method: 'POST', body: JSON.stringify(body) });

export const submitStoreApplication = (body) =>
  request('/store-applications', { method: 'POST', body: JSON.stringify(body) });

export const submitCallRequest = (body) =>
  request('/call-requests', { method: 'POST', body: JSON.stringify(body) });
