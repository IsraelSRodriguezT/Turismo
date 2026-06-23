import React from 'react';
import { Link } from 'react-router-dom';

export default function Reportes() {
  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Reportes</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-lg">
        <div className="bg-surface rounded-xl border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Distribución por Categoría</h2>
          <div className="space-y-md">
            <div>
              <div className="flex justify-between mb-1"><span className="font-body-md text-body-md text-on-surface">Cultural</span><span className="font-body-md text-body-md text-on-surface-variant">0%</span></div>
              <div className="w-full bg-surface-container-low rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: '0%' }}></div></div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Top Calificaciones</h2>
          <div className="space-y-md">
            <p className="font-body-md text-body-md text-on-surface-variant text-center py-xl">No hay datos disponibles</p>
          </div>
        </div>
      </div>
      <div className="bg-surface rounded-xl border border-outline-variant p-lg">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Historial de Modificaciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-low"><th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Fecha</th><th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Usuario</th><th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Acción</th></tr></thead>
            <tbody className="divide-y divide-outline-variant">
              <tr><td colSpan="3" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay registros</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
