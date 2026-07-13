import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  'flex items-center gap-md px-md py-sm font-label-md text-label-md rounded-lg transition-all ' +
  (isActive
    ? 'bg-secondary-container text-on-secondary-container font-bold'
    : 'text-on-surface-variant hover:bg-surface-container transition-all');

const subLinkClass = ({ isActive }) =>
  'flex items-center gap-md px-md py-sm font-label-md text-label-md rounded-lg transition-all ' +
  (isActive
    ? 'bg-secondary-container text-on-secondary-container font-bold'
    : 'text-on-surface-variant hover:bg-surface-container transition-all');

export default function UserPanel() {
  const { logout, hasRole } = useAuth();
  const [invOpen, setInvOpen] = useState(false);
  const esTurista = hasRole('TURISTA');

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-md z-40 bg-surface border-r border-outline-variant w-64 overflow-y-auto">
      <div className="flex flex-col gap-xs mb-xl">
        <Link to={esTurista ? '/explorador' : '/dashboard'} className="flex items-center gap-sm px-sm">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Gestión PIT</h2>
            <p className="font-label-md text-label-md text-on-surface-variant">Turista</p>
          </div>
        </Link>
      </div>

      {esTurista ? (
        <nav className="flex-1 flex flex-col gap-xs">
          <NavLink to="/explorador" className={navLinkClass}>
            <span className="material-symbols-outlined">map</span>
            <span>Mapa Interactivo</span>
          </NavLink>
        </nav>
      ) : (
        <>
          <nav className="flex-1 flex flex-col gap-xs">
            <NavLink to="/dashboard" className={navLinkClass}>
              <span className="material-symbols-outlined">home</span>
              <span>Inicio</span>
            </NavLink>

            <NavLink to="/usuarios" className={navLinkClass}>
              <span className="material-symbols-outlined">group</span>
              <span>Usuarios</span>
            </NavLink>

            <NavLink to="/geolocalizacion" className={navLinkClass}>
              <span className="material-symbols-outlined">location_on</span>
              <span>Geolocalización</span>
            </NavLink>

            <div className="flex flex-col gap-xs">
              <button
                onClick={() => setInvOpen(!invOpen)}
                className="flex items-center justify-between px-md py-sm w-full text-left"
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
          </nav>
        </>
      )}

      <div className="border-t border-outline-variant pt-md space-y-xs">
        <Link to="/ayuda" className="flex items-center gap-md px-md py-sm font-label-md text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">
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
