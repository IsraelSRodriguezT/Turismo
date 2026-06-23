import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import Acerca from './pages/web/Acerca';
import Dashboard from './pages/web/Dashboard';
import Perfil from './pages/web/Perfil';
import Settings from './pages/web/Settings';
import ListaAtractivos from './pages/web/ListaAtractivos';
import DetalleAtractivo from './pages/web/DetalleAtractivo';
import RegistroAtractivo from './pages/web/RegistroAtractivo';
import ExploradorAtractivos from './pages/web/ExploradorAtractivos';
import RutasMapa from './pages/web/RutasMapa';
import Publicaciones from './pages/web/Publicaciones';
import EnlacesExternos from './pages/web/EnlacesExternos';
import ImportarRecursos from './pages/web/ImportarRecursos';
import EditarAtractivo from './pages/web/EditarAtractivo';
import Reportes from './pages/web/Reportes';
import Investigacion from './pages/web/Investigacion';
import Geolocalizacion from './pages/web/Geolocalizacion';
import EstadosEspeciales from './pages/web/EstadosEspeciales';
import Usuarios from './pages/web/Usuarios';
import RegistroUsuario from './pages/web/RegistroUsuario';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminPaises from './pages/admin/AdminPaises';
import AdminProvincias from './pages/admin/AdminProvincias';
import AdminCantones from './pages/admin/AdminCantones';
import AdminParroquias from './pages/admin/AdminParroquias';
import AdminSectores from './pages/admin/AdminSectores';
import AdminAtractivos from './pages/admin/AdminAtractivos';
import AdminClasificaciones from './pages/admin/AdminClasificaciones';
import AdminReportes from './pages/admin/AdminReportes';
import AdminInvestigacion from './pages/admin/AdminInvestigacion';

// Helper: envuelve page en Layout + ProtectedRoute
function ProtectedLayout({ title, children }) {
  return (
    <ProtectedRoute>
      <Layout title={title}>{children}</Layout>
    </ProtectedRoute>
  );
}

// Helper: envuelve page en AdminLayout + ProtectedRoute
function ProtectedAdmin({ title, children }) {
  return (
    <ProtectedRoute>
      <AdminLayout title={title}>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/acerca" element={<Acerca />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/registro-usuario" element={<RegistroUsuario />} />

      {/* Rutas protegidas (requieren sesión iniciada) */}
      <Route path="/dashboard" element={<ProtectedLayout title="Dashboard Principal | PIT"><Dashboard /></ProtectedLayout>} />
      <Route path="/perfil" element={<ProtectedLayout title="Mi Perfil | PIT"><Perfil /></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout title="Configuración | PIT"><Settings /></ProtectedLayout>} />
      <Route path="/lista-atractivos" element={<ProtectedLayout title="Lista de Atractivos | PIT"><ListaAtractivos /></ProtectedLayout>} />
      <Route path="/detalle-atractivo/:id" element={<ProtectedLayout title="Detalle de Atractivo | PIT"><DetalleAtractivo /></ProtectedLayout>} />
      <Route path="/registro-atractivo" element={<ProtectedLayout title="Registro de Atractivo | PIT"><RegistroAtractivo /></ProtectedLayout>} />
      <Route path="/editar-atractivo/:id" element={<ProtectedLayout title="Editar Atractivo | PIT"><EditarAtractivo /></ProtectedLayout>} />
      <Route path="/explorador" element={<ProtectedLayout title="Explorador | PIT"><ExploradorAtractivos /></ProtectedLayout>} />
      <Route path="/rutas" element={<ProtectedLayout title="Rutas Turísticas | PIT"><RutasMapa /></ProtectedLayout>} />
      <Route path="/publicaciones" element={<ProtectedLayout title="Publicaciones | PIT"><Publicaciones /></ProtectedLayout>} />
      <Route path="/enlaces-externos" element={<ProtectedLayout title="Enlaces Externos | PIT"><EnlacesExternos /></ProtectedLayout>} />
      <Route path="/importar-recursos" element={<ProtectedLayout title="Importar Recursos | PIT"><ImportarRecursos /></ProtectedLayout>} />
      <Route path="/reportes" element={<ProtectedLayout title="Reportes | PIT"><Reportes /></ProtectedLayout>} />
      <Route path="/investigacion" element={<ProtectedLayout title="Investigación | PIT"><Investigacion /></ProtectedLayout>} />
      <Route path="/geolocalizacion" element={<ProtectedLayout title="Geolocalización | PIT"><Geolocalizacion /></ProtectedLayout>} />
      <Route path="/estados-especiales" element={<ProtectedLayout title="Estados Especiales | PIT"><EstadosEspeciales /></ProtectedLayout>} />
      <Route path="/usuarios" element={<ProtectedLayout title="Gestión de Usuarios | PIT"><Usuarios /></ProtectedLayout>} />

      {/* Rutas de administración protegidas */}
      <Route path="/admin/usuarios" element={<ProtectedAdmin title="Administración de Usuarios"><AdminUsuarios /></ProtectedAdmin>} />
      <Route path="/admin/paises" element={<ProtectedAdmin title="Gestión de Países"><AdminPaises /></ProtectedAdmin>} />
      <Route path="/admin/provincias" element={<ProtectedAdmin title="Gestión de Provincias"><AdminProvincias /></ProtectedAdmin>} />
      <Route path="/admin/cantones" element={<ProtectedAdmin title="Gestión de Cantones"><AdminCantones /></ProtectedAdmin>} />
      <Route path="/admin/parroquias" element={<ProtectedAdmin title="Gestión de Parroquias"><AdminParroquias /></ProtectedAdmin>} />
      <Route path="/admin/sectores" element={<ProtectedAdmin title="Gestión de Sectores"><AdminSectores /></ProtectedAdmin>} />
      <Route path="/admin/atractivos" element={<ProtectedAdmin title="Gestión de Atractivos"><AdminAtractivos /></ProtectedAdmin>} />
      <Route path="/admin/clasificaciones" element={<ProtectedAdmin title="Gestión de Clasificaciones"><AdminClasificaciones /></ProtectedAdmin>} />
      <Route path="/admin/reportes" element={<ProtectedAdmin title="Reportes Administrativos"><AdminReportes /></ProtectedAdmin>} />
      <Route path="/admin/investigacion" element={<ProtectedAdmin title="Investigación"><AdminInvestigacion /></ProtectedAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
