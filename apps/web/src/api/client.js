const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const TOKEN_KEY = "hiresync_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage unavailable; user will need to sign in again next visit
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // nothing to clear
  }
}

/** @returns {Record<string, string>} */
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// An expired or missing token means every request will fail; send the user to sign in again.
function handleUnauthorized(res) {
  if (res.status !== 401) return;
  clearToken();
  if (window.location.pathname !== "/login") window.location.assign("/login");
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Sign in failed with status ${res.status}`);
  }
  setToken(data.token);
  return data;
}

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
  handleUnauthorized(res);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

async function mutate(path, method, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  handleUnauthorized(res);
  if (!res.ok) {
    let message = `Request to ${path} failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function getDashboard() {
  return request("/dashboard");
}

export function getCandidates(filters) {
  return request(`/candidates${buildQuery(filters)}`);
}

export function getCandidate(id) {
  return request(`/candidates/${id}`);
}

export function getApplications(filters) {
  return request(`/applications${buildQuery(filters)}`);
}

export function getApplication(id) {
  return request(`/applications/${id}`);
}

export function createCandidate(data) {
  return mutate("/candidates", "POST", data);
}

export function updateCandidate(id, data) {
  return mutate(`/candidates/${id}`, "PATCH", data);
}

export function deleteCandidate(id) {
  return mutate(`/candidates/${id}`, "DELETE");
}

export function createApplication(data) {
  return mutate("/applications", "POST", data);
}

export function updateApplication(id, data) {
  return mutate(`/applications/${id}`, "PATCH", data);
}

export function deleteApplication(id) {
  return mutate(`/applications/${id}`, "DELETE");
}
