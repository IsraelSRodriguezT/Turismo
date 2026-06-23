import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function ListaAtractivos() {
  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/atractivos/atractivos/')
      .then(r => setAtractivos(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Lista de Atractivos</span>
      </nav>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Atractivos Turísticos</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: {atractivos.length} atractivos</p>
        </div>
        <Link to="/registro-atractivo" className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
          <span className="material-symbols-outlined">add</span>Nuevo Atractivo
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {loading ? (
          <div className="col-span-full text-center py-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-md animate-spin">autorenew</span>
            <p className="font-body-lg text-body-lg">Cargando atractivos...</p>
          </div>
        ) : atractivos.length === 0 ? (
          <div className="col-span-full text-center py-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-md">landscape</span>
            <p className="font-body-lg text-body-lg">No hay atractivos registrados</p>
          </div>
        ) : (
          atractivos.map((a) => (
            <div key={a.id} className="bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant">landscape</span>
              </div>
              <div className="p-lg">
                <div className="flex items-center gap-sm mb-sm">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{a.nombre}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    a.estado === 'PUBLICADO' ? 'bg-success/20 text-success' :
                    a.estado === 'BORRADOR' ? 'bg-warning/20 text-warning' :
                    a.estado === 'REVISION' ? 'bg-primary/20 text-primary' : 'bg-surface-container-low text-on-surface-variant'
                  }`}>{a.estado}</span>
                </div>
                <p className="font-body-md text-body-md text-secondary line-clamp-2 mb-md">{a.descripcion || 'Sin descripción'}</p>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{a.nivel_accesibilidad}</span>
                  <Link to={`/detalle-atractivo/${a.id}`} className="text-primary font-label-md hover:underline">Ver detalle</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
