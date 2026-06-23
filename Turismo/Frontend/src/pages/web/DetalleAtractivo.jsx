import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/httpClient';

export default function DetalleAtractivo() {
  const { id } = useParams();
  const [atractivo, setAtractivo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/atractivos/atractivos/${id}/`)
      .then(r => setAtractivo(r.data.data || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
          <p className="font-body-md text-on-surface-variant mt-md">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!atractivo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-md">Atractivo no encontrado</p>
          <Link to="/lista-atractivos" className="text-primary font-label-md mt-md inline-block hover:underline">Volver a lista</Link>
        </div>
      </div>
    );
  }

  const ubi = atractivo.ubicacion || {};
  const dir = ubi.direccion || {};
  const clima = ubi.informacion_climatica || {};

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/lista-atractivos" className="hover:text-primary">Atractivos</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">{atractivo.nombre}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-lg">
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <div className="aspect-video bg-surface-container flex items-center justify-center relative">
              <span className="material-symbols-outlined text-[64px] text-on-surface-variant">landscape</span>
            </div>
            <div className="p-lg">
              <div className="flex items-center gap-sm mb-sm">
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">{atractivo.nombre}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  atractivo.estado === 'PUBLICADO' ? 'bg-success/20 text-success' :
                  atractivo.estado === 'BORRADOR' ? 'bg-warning/20 text-warning' :
                  atractivo.estado === 'REVISION' ? 'bg-primary/20 text-primary' : 'bg-surface-container-low text-on-surface-variant'
                }`}>{atractivo.estado}</span>
              </div>
              <p className="font-body-md text-body-md text-secondary mb-lg">{atractivo.descripcion || 'Sin descripción'}</p>
              <div className="flex flex-wrap gap-md">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">lock_open</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">{atractivo.nivel_accesibilidad}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">{atractivo.estado_conservacion}</span>
                </div>
                {dir.referencia && (
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">{dir.referencia}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Clima</p>
                <p className="font-body-md text-body-md text-on-surface">{clima.clima || '—'}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Temperatura</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {clima.temperatura_minima != null ? `${clima.temperatura_minima}°C - ${clima.temperatura_maxima}°C` : '—'}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Horarios</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {atractivo.horarios?.length > 0 ? atractivo.horarios.map(h => `${h.hora_inicio} - ${h.hora_fin}`).join(', ') : '—'}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Servicios</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {atractivo.servicios?.length > 0 ? atractivo.servicios.length + ' servicio(s)' : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-lg">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Coordenadas</h3>
            <div className="space-y-md">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Latitud</p>
                <p className="font-body-md text-body-md text-on-surface">{ubi.latitud != null ? ubi.latitud : '—'}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Longitud</p>
                <p className="font-body-md text-body-md text-on-surface">{ubi.longitud != null ? ubi.longitud : '—'}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Acciones</h3>
            <div className="space-y-md">
              <Link to={`/editar-atractivo/${id}`} className="w-full flex items-center justify-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
                <span className="material-symbols-outlined">edit</span>Editar
              </Link>
              <Link to="/lista-atractivos" className="w-full flex items-center justify-center gap-md px-lg py-md border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined">arrow_back</span>Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
