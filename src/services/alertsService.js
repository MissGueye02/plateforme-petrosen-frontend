import { apiRequest } from "./AuthService";

export async function getAlertes() {
  return apiRequest("/alertes");
}

export async function getAlertesActives() {
  return apiRequest("/alertes/actives");
}

export async function traiterAlerte(id) {
  return apiRequest(`/alertes/${id}/traiter`, { method: "PATCH" });
}

export async function ignorerAlerte(id) {
  return apiRequest(`/alertes/${id}/ignorer`, { method: "PATCH" });
}

export async function getAlerteStats() {
  return apiRequest("/alertes/stats");
}
