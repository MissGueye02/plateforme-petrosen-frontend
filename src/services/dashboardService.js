import { apiRequest } from "./AuthService";

export async function getDashboardData(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/tableau-bord${query ? `?${query}` : ""}`);
}
