import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { homeForRole, normalizeRole } from "../utils/roles";

export default function RoleRoute({ role, roles, children }) {
  const { user } = useAuth();
  const allowed = roles || (role ? [role] : []);

  if (!user) return <Navigate to="/login" replace />;

  const current = normalizeRole(user.role);
  if (!allowed.map(normalizeRole).includes(current)) {
    return <Navigate to={homeForRole(current)} replace />;
  }

  return children ?? <Outlet />;
}
