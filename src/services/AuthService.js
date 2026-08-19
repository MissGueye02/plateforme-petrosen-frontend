const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000/api";

export function getToken() {
  return localStorage.getItem("petrosen_token");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("petrosen_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(identifiant, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ identifiant, password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Erreur lors de la connexion.");

  localStorage.setItem("petrosen_token", data.token);
  localStorage.setItem("petrosen_user", JSON.stringify(data.user));
  return data;
}

export async function logout() {
  const token = getToken();
  try {
    if (token) await fetch(`${API_URL}/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  } finally {
    localStorage.removeItem("petrosen_token");
    localStorage.removeItem("petrosen_user");
  }
}

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers || {}) },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    let message = typeof data === "object" ? data.message : data;
    if (data?.errors) {
      const details = Object.values(data.errors).flat().join(" ");
      if (details) message = `${message || "Erreur"} ${details}`;
    }
    throw new Error(message || `Erreur HTTP ${response.status}`);
  }

  return data;
}
