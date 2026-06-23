import React from 'react';
import { Link } from 'react-router-dom';

export default function Investigacion() {
  const proyectos = [];

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Investigación</span>
      </nav>
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Proyectos de Investigación</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Explora los proyectos académicos de la UNL</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {proyectos.length === 0 ? (
          <div className="col-span-full text-center py-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-md">science</span>
            <p className="font-body-lg text-body-lg">No hay proyectos registrados</p>
          </div>
        ) : (
          proyectos.map((p, i) => (
            <div key={i} className="bg-surface rounded-xl border border-outline-variant p-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-sm mb-md">
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">science</span>
                </div>
                <div><h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{p.titulo}</h3></div>
              </div>
              <p className="font-body-md text-body-md text-secondary line-clamp-3 mb-md">{p.descripcion}</p>
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{p.fecha_inicio || '—'}</span>
                <span className="font-label-md text-label-md text-primary">Ver más</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
