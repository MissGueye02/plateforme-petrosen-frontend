import { apiRequest } from "./AuthService";

export const getUtilisateurs = () => apiRequest("/utilisateurs");
export const getRoles = () => apiRequest("/roles");
export const creerUtilisateur = payload => apiRequest("/utilisateurs", { method: "POST", body: JSON.stringify(payload) });
export const modifierMonProfil = payload => apiRequest("/utilisateurs/me", { method: "PUT", body: JSON.stringify(payload) });
export const modifierUtilisateur = (id, payload) => apiRequest(`/utilisateurs/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const supprimerUtilisateur = id => apiRequest(`/utilisateurs/${id}`, { method: "DELETE" });
