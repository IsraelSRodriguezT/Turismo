import React from 'react';
import { Link } from 'react-router-dom';

export default function EstadosEspeciales() {
  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Estados Especiales</span>
      </nav>
      <div className="space-y-lg">
        <div className="bg-surface rounded-xl border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Componentes de UI</h2>
          <div className="space-y-lg">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-md">Badges / Etiquetas de estado</p>
              <div className="flex flex-wrap gap-md">
                <span className="px-3 py-1 bg-primary text-on-primary rounded-full font-badge text-badge">Activo</span>
                <span className="px-3 py-1 bg-success text-white rounded-full font-badge text-badge">Completado</span>
                <span className="px-3 py-1 bg-warning text-white rounded-full font-badge text-badge">Pendiente</span>
                <span className="px-3 py-1 bg-error text-white rounded-full font-badge text-badge">Error</span>
                <span className="px-3 py-1 bg-outline-variant text-on-surface-variant rounded-full font-badge text-badge">Inactivo</span>
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-badge text-badge">Borrador</span>
              </div>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-md">Cards informativas</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="border-l-4 border-l-primary bg-surface-container-low p-md rounded-r-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Información</p>
                  <p className="font-body-md text-body-md text-on-surface">Card con borde izquierdo</p>
                </div>
                <div className="border-l-4 border-l-error bg-surface-container-low p-md rounded-r-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Error</p>
                  <p className="font-body-md text-body-md text-on-surface">Mensaje de error</p>
                </div>
                <div className="border-l-4 border-l-secondary bg-surface-container-low p-md rounded-r-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Aviso</p>
                  <p className="font-body-md text-body-md text-on-surface">Nota informativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
