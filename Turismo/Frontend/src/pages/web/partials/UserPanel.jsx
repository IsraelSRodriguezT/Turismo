import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  'flex items-center gap-md px-md py-sm font-label-md text-label-md rounded-lg transition-all ' +
  (isActive ? 'text-primary bg-surface-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary');

const subLinkClass = ({ isActive }) =>
  'flex items-center gap-md px-md py-sm font-label-md text-label-md rounded-lg transition-all ' +
  (isActive ? 'text-primary bg-surface-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary');

export default function UserPanel() {
  const { logout } = useAuth();
  const [geoOpen, setGeoOpen] = useState(false);
  const [invOpen, setInvOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-md z-40 bg-surface border-r border-outline-variant w-64 overflow-y-auto">
      <div className="flex flex-col gap-xs mb-xl">
        <Link to="/dashboard" className="flex items-center gap-sm px-sm">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">PIT</h2>
            <p className="font-label-md text-label-md text-on-surface-variant">Plataforma Turismo</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-xs">
        <NavLink to="/dashboard" className={navLinkClass}>
          <span className="material-symbols-outlined">home</span>
          <span>Inicio</span>
        </NavLink>

        <NavLink to="/rutas" className={navLinkClass}>
          <span className="material-symbols-outlined">alt_route</span>
          <span>Rutas Turísticas</span>
        </NavLink>

        <NavLink to="/publicaciones" className={navLinkClass}>
          <span className="material-symbols-outlined">publish</span>
          <span>Publicaciones</span>
        </NavLink>

        <NavLink to="/enlaces-externos" className={navLinkClass}>
          <span className="material-symbols-outlined">link</span>
          <span>Enlaces Externos</span>
        </NavLink>

        <NavLink to="/importar-recursos" className={navLinkClass}>
          <span className="material-symbols-outlined">upload_file</span>
          <span>Importar Archivos</span>
        </NavLink>

        <NavLink to="/usuarios" className={navLinkClass}>
          <span className="material-symbols-outlined">group</span>
          <span>Usuarios</span>
        </NavLink>

        <div className="flex flex-col gap-xs">
          <button
            onClick={() => setGeoOpen(!geoOpen)}
            className="flex items-center justify-between px-md py-sm cursor-pointer w-full text-left"
          >
            <div className="flex items-center gap-md font-label-md text-label-md text-on-surface-variant">
              <span className="material-symbols-outlined">location_on</span>
              <span>Geolocalización</span>
            </div>
            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${geoOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          {geoOpen && (
            <div className="flex flex-col gap-xs pl-md">
              <NavLink to="/admin/paises" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">flag</span>
                <span>Países</span>
              </NavLink>
              <NavLink to="/admin/provincias" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">map</span>
                <span>Provincias</span>
              </NavLink>
              <NavLink to="/admin/cantones" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">location_city</span>
                <span>Cantones</span>
              </NavLink>
              <NavLink to="/admin/parroquias" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">domain</span>
                <span>Parroquias</span>
              </NavLink>
              <NavLink to="/admin/sectores" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">public</span>
                <span>Sectores</span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <button
            onClick={() => setInvOpen(!invOpen)}
            className="flex items-center justify-between px-md py-sm cursor-pointer w-full text-left"
          >
            <div className="flex items-center gap-md font-label-md text-label-md text-on-surface-variant">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Inventario</span>
            </div>
            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${invOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          {invOpen && (
            <div className="flex flex-col gap-xs pl-md">
              <NavLink to="/admin/atractivos" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">landscape</span>
                <span>Atractivos</span>
              </NavLink>
              <NavLink to="/admin/clasificaciones" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">category</span>
                <span>Clasificaciones</span>
              </NavLink>
              <NavLink to="/admin/reportes" className={subLinkClass}>
                <span className="material-symbols-outlined text-sm">assessment</span>
                <span>Reportes</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/investigacion" className={navLinkClass}>
          <span className="material-symbols-outlined">science</span>
          <span>Investigación</span>
        </NavLink>

        <NavLink to="/perfil" className={navLinkClass}>
          <span className="material-symbols-outlined">person</span>
          <span>Perfil</span>
        </NavLink>

        <NavLink to="/settings" className={navLinkClass}>
          <span className="material-symbols-outlined">settings</span>
          <span>Configuración</span>
        </NavLink>
      </nav>

      <div className="border-t border-outline-variant pt-md space-y-xs">
        <Link to="/acerca" className="flex items-center gap-md px-md py-sm font-label-md text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">
          <span className="material-symbols-outlined">help</span>
          <span>Ayuda</span>
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-md px-md py-sm font-label-md text-label-md text-danger hover:bg-error-container rounded-lg transition-all">
          <span className="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
