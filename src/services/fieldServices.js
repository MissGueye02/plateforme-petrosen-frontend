import { apiRequest } from "./AuthService";

export const getMissions = () => apiRequest("/mes-missions");
export const accepterMission = id =>
    apiRequest(`/missions/${id}/accepter`, { method: "PATCH" });

export const refuserMission = id =>
    apiRequest(`/missions/${id}/refuser`, { method: "PATCH" });

export const getEngineerReports = () =>
    apiRequest("/ingenieur/rapports");

export const createEngineerReport = payload =>
    apiRequest("/ingenieur/rapports", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const getPuits = () => apiRequest("/puits");

export const getBlocs = (consult = false) =>
    apiRequest(consult ? "/consult/blocs" : "/blocs");

export const createBloc = payload =>
    apiRequest("/blocs", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const updateBloc = (id, payload) =>
    apiRequest(`/blocs/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

export const deleteBloc = id =>
    apiRequest(`/blocs/${id}`, {
        method: "DELETE",
    });

export const getBlocPuits = id =>
    apiRequest(`/blocs/${id}/puits`);

export const createPuits = (blocId, payload) =>
    apiRequest(`/blocs/${blocId}/puits`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const getGisements = (consult = false) =>
    apiRequest(consult ? "/consult/gisements" : "/gisements");

export const createGisement = payload =>
    apiRequest("/gisements", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const updateGisement = (id, payload) =>
    apiRequest(`/gisements/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

export const deleteGisement = id =>
    apiRequest(`/gisements/${id}`, {
        method: "DELETE",
    });

export const getProductionSuivi = params =>
    apiRequest(
        `/chef/productions${
            params ? `?${new URLSearchParams(params)}` : ""
        }`
    );

export const getProductionStats = params =>
    apiRequest(
        `/chef/productions/stats${
            params ? `?${new URLSearchParams(params)}` : ""
        }`
    );

export const getChefReports = () =>
    apiRequest("/chef/rapports");

export const getPartners = () =>
    apiRequest("/chef/partenaires");

export const validateReport = id =>
    apiRequest(`/chef/rapports/${id}/valider`, {
        method: "PATCH",
    });

export const requestReportCorrection = (id, commentaire) =>
    apiRequest(`/chef/rapports/${id}/demander-correction`, {
        method: "PATCH",
        body: JSON.stringify({ commentaire }),
    });

export const createProjectFromReport = (id, payload) =>
    apiRequest(`/chef/rapports/${id}/projet`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const publishProject = id =>
    apiRequest(`/chef/projets/${id}/publier`, {
        method: "PATCH",
    });

export const getPartnerProjects = () =>
    apiRequest("/partenaire/projets");

export const getPartnerProject = id =>
    apiRequest(`/partenaire/projets/${id}`);

export const getPartnerReports = () =>
    apiRequest("/partenaire/rapports");

export const getAuditorReports = params =>
    apiRequest(
        `/auditeur/rapports${
            params ? `?${new URLSearchParams(params)}` : ""
        }`
    );

export const exportAuditorReport = (id, format = "csv") =>
    apiRequest(
        `/auditeur/rapports/${id}/export?format=${format}`
    );

export const getNotifications = () =>
    apiRequest("/notifications");

export const markNotificationRead = id =>
    apiRequest(`/notifications/${id}/lu`, {
        method: "PATCH",
    });

export const markAllNotificationsRead = () =>
    apiRequest("/notifications/mark-all-lu", {
        method: "PATCH",
    });

export const getRolesDetail = () =>
    apiRequest("/roles/detail");

export const signalerAnomalie = payload =>
    apiRequest("/alertes", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const getEngineers = () =>
    apiRequest("/chef/ingenieurs");

export const planifierIntervention = (id, payload) =>
    apiRequest(`/alertes/${id}/planifier`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const commentPartnerReport = (id, contenu) =>
    apiRequest(`/partenaire/rapports/${id}/comment`, {
        method: "POST",
        body: JSON.stringify({ contenu }),
    });

export const commentAuditorReport = (id, contenu) =>
    apiRequest(`/auditeur/rapports/${id}/comment`, {
        method: "POST",
        body: JSON.stringify({ contenu }),
    });