export const ROLE_CODES = {
  ADMIN: "administrateur",
  ENGINEER: "ingenieur_terrain",
  PROJECT_MANAGER: "chef_projet",
  PARTNER: "partenaire",
  AUDITOR: "auditeur_itie",
};

export function normalizeRole(role) {
  if (!role) return null;
  const value = String(role).trim().toLowerCase();
  const aliases = {
    administrateur: ROLE_CODES.ADMIN,
    "ingenieur terrain": ROLE_CODES.ENGINEER,
    "ingénieur terrain": ROLE_CODES.ENGINEER,
    ingenieur_terrain: ROLE_CODES.ENGINEER,
    "chef de projet": ROLE_CODES.PROJECT_MANAGER,
    chef_projet: ROLE_CODES.PROJECT_MANAGER,
    partenaire: ROLE_CODES.PARTNER,
    "auditeur itie": ROLE_CODES.AUDITOR,
    auditeur_itie: ROLE_CODES.AUDITOR,
  };
  return aliases[value] || value;
}

export function roleLabel(role) {
  const code = normalizeRole(role);
  return {
    [ROLE_CODES.ADMIN]: "Administrateur",
    [ROLE_CODES.ENGINEER]: "Ingénieur de terrain",
    [ROLE_CODES.PROJECT_MANAGER]: "Chef de projet",
    [ROLE_CODES.PARTNER]: "Partenaire",
    [ROLE_CODES.AUDITOR]: "Auditeur ITIE",
  }[code] || role || "Utilisateur";
}

export function homeForRole(role) {
  switch (normalizeRole(role)) {
    case ROLE_CODES.PARTNER:
      return "/partenaire/projets";
    case ROLE_CODES.AUDITOR:
      return "/auditeur/rapports";
    default:
      return "/dashboard";
  }
}
