const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
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
