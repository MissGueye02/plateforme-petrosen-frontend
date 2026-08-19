import { apiRequest } from "./AuthService";

/**
 * Envoie la saisie de production au backend.
 * @param {{puits_id:number, date_production:string, volume:number, pression:number}} payload
 * @returns {Promise<{success:boolean, message:string, niveau:'normal'|'anormal', production:object, alerte:object|null}>}
 */
export async function creerProduction(payload) {
  return apiRequest("/productions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPuitsDisponibles() {
  return apiRequest("/puits", {
    method: "GET",
  });
}

export default { creerProduction, getPuitsDisponibles };
