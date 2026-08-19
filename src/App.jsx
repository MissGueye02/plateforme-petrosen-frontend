import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { homeForRole, ROLE_CODES } from "./utils/roles";
import RoleRoute from "./routes/RoleRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductionPage from "./pages/ProductionPage";
import AlertsPage from "./pages/AlertsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import MissionsPage from "./pages/MissionsPage";
import EngineerReportsPage from "./pages/EngineerReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import BlocksPage from "./pages/BlocksPage";
import GisementsPage from "./pages/GisementsPage";
import ProductionSuiviPage from "./pages/ProductionSuiviPage";
import ChefReportsPage from "./pages/ChefReportsPage";
import PartnerProjectsPage from "./pages/PartnerProjectsPage";
import PartnerReportsPage from "./pages/PartnerReportsPage";
import AuditorReportsPage from "./pages/AuditorReportsPage";
import RolesPage from "./pages/RolesPage";
import ThresholdsPage from "./pages/ThresholdsPage";
import "./App.css";

function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to={homeForRole(user?.role)} replace />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { user, isAuthenticated, login, logout, updateUser } = useAuth();

  return <Routes>
    <Route path="/login" element={<PublicOnlyRoute><Login onLoginSuccess={login} /></PublicOnlyRoute>} />

    <Route element={<ProtectedRoute><RoleRoute roles={[ROLE_CODES.ADMIN, ROLE_CODES.ENGINEER, ROLE_CODES.PROJECT_MANAGER]} /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute role={ROLE_CODES.ENGINEER} /></ProtectedRoute>}>
      <Route path="/production/nouvelle" element={<ProductionPage user={user} onLogout={logout} />} />
      <Route path="/mes-missions" element={<MissionsPage />} />
      <Route path="/ingenieur/rapports" element={<EngineerReportsPage />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute roles={[ROLE_CODES.ADMIN, ROLE_CODES.ENGINEER, ROLE_CODES.PROJECT_MANAGER]} /></ProtectedRoute>}>
      <Route path="/alertes" element={<AlertsPage user={user} onLogout={logout} />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute role={ROLE_CODES.ADMIN} /></ProtectedRoute>}>
      <Route path="/utilisateurs" element={<UsersPage user={user} />} />
      <Route path="/roles" element={<RolesPage />} />
      <Route path="/seuils" element={<ThresholdsPage />} />
      <Route path="/rapports" element={<ReportsPage user={user} />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute role={ROLE_CODES.PROJECT_MANAGER} /></ProtectedRoute>}>
      <Route path="/blocs" element={<BlocksPage />} />
      <Route path="/gisements" element={<GisementsPage />} />
      <Route path="/chef/productions" element={<ProductionSuiviPage />} />
      <Route path="/chef/rapports" element={<ChefReportsPage />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute role={ROLE_CODES.PARTNER} /></ProtectedRoute>}>
      <Route path="/partenaire/projets" element={<PartnerProjectsPage />} />
      <Route path="/partenaire/rapports" element={<PartnerReportsPage />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute role={ROLE_CODES.AUDITOR} /></ProtectedRoute>}>
      <Route path="/auditeur/rapports" element={<AuditorReportsPage />} />
    </Route>

    <Route element={<ProtectedRoute><RoleRoute roles={[ROLE_CODES.ADMIN, ROLE_CODES.ENGINEER, ROLE_CODES.PROJECT_MANAGER, ROLE_CODES.PARTNER, ROLE_CODES.AUDITOR]} /></ProtectedRoute>}>
      <Route path="/profil" element={<ProfilePage user={user} onProfileUpdated={updateUser} />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Route>

    <Route path="/" element={<Navigate to={isAuthenticated ? homeForRole(user?.role) : "/login"} replace />} />
    <Route path="*" element={<Navigate to={isAuthenticated ? homeForRole(user?.role) : "/login"} replace />} />
  </Routes>;
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppContent /></BrowserRouter></AuthProvider>;
}
