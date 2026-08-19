import { apiRequest } from "./AuthService";

export async function getRapports() {
  return apiRequest("/rapports");
}

export async function creerRapport(payload) {
  return apiRequest("/rapports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
