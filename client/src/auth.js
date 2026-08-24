const KEY = "glt_client";

export function getClient() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setClient(client) {
  localStorage.setItem(KEY, JSON.stringify(client));
}

export function clearClient() {
  localStorage.removeItem(KEY);
}
