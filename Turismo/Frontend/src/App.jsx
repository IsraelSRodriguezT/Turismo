import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import Dashboard from './pages/web/Dashboard';
import Perfil from './pages/web/Perfil';
import Settings from './pages/web/Settings';
import ExploradorAtractivos from './pages/web/ExploradorAtractivos';
import Geolocalizacion from './pages/web/Geolocalizacion';
import Ayuda from './pages/web/Ayuda';
import Usuarios from './pages/web/Usuarios';
import AdminAtractivos from './pages/admin/AdminAtractivos';
import AdminClasificaciones from './pages/admin/AdminClasificaciones';
import AdminReportes from './pages/admin/AdminReportes';
import AdminInvestigacion from './pages/admin/AdminInvestigacion';

const ROLES_NO_TURISTA = ['ADMINISTRADOR', 'GESTOR_TERRITORIAL', 'GESTOR_TURISTICO', 'INVESTIGADOR'];

// Helper: envuelve page en Layout + ProtectedRoute
function ProtectedLayout({ title, children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout title={title}>{children}</Layout>
    </ProtectedRoute>
  );
}

// Helper: envuelve page en AdminLayout + ProtectedRoute
function ProtectedAdmin({ title, children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AdminLayout title={title}>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas (requieren sesión iniciada) */}
      <Route path="/dashboard" element={<ProtectedLayout allowedRoles={ROLES_NO_TURISTA} title="Dashboard Principal | PIT"><Dashboard /></ProtectedLayout>} />
      <Route path="/perfil" element={<ProtectedLayout allowedRoles={ROLES_NO_TURISTA} title="Mi Perfil | PIT"><Perfil /></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout allowedRoles={ROLES_NO_TURISTA} title="Configuración | PIT"><Settings /></ProtectedLayout>} />
      <Route path="/explorador" element={<ProtectedLayout title="Explorador | PIT"><ExploradorAtractivos /></ProtectedLayout>} />
      <Route path="/geolocalizacion" element={<ProtectedLayout allowedRoles={ROLES_NO_TURISTA} title="Geolocalización | PIT"><Geolocalizacion /></ProtectedLayout>} />
      <Route path="/ayuda" element={<ProtectedLayout allowedRoles={ROLES_NO_TURISTA} title="Centro de Ayuda | PIT"><Ayuda /></ProtectedLayout>} />
      <Route path="/usuarios" element={<ProtectedLayout allowedRoles={ROLES_NO_TURISTA} title="Gestión de Usuarios | PIT"><Usuarios /></ProtectedLayout>} />

      {/* Rutas de administración protegidas */}
      <Route path="/admin/atractivos" element={<ProtectedAdmin allowedRoles={ROLES_NO_TURISTA} title="Gestión de Atractivos"><AdminAtractivos /></ProtectedAdmin>} />
      <Route path="/admin/clasificaciones" element={<ProtectedAdmin allowedRoles={ROLES_NO_TURISTA} title="Gestión de Clasificaciones"><AdminClasificaciones /></ProtectedAdmin>} />
      <Route path="/admin/reportes" element={<ProtectedAdmin allowedRoles={ROLES_NO_TURISTA} title="Reportes Administrativos"><AdminReportes /></ProtectedAdmin>} />
      <Route path="/admin/investigacion" element={<ProtectedAdmin allowedRoles={ROLES_NO_TURISTA} title="Investigación"><AdminInvestigacion /></ProtectedAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
