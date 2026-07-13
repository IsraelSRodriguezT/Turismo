import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

const ESTADO_INFO = {
  CREACION: { label: 'Completado', clase: 'bg-success-container text-on-success-container', icono: 'check_circle' },
  MODIFICACION: { label: 'Actualizado', clase: 'bg-primary-fixed text-on-primary-fixed', icono: 'edit' },
  ELIMINACION: { label: 'Eliminado', clase: 'bg-error-container text-on-error-container', icono: 'delete' },
};

function getInitials(str) {
  if (!str) return '--';
  return str.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/usuarios/dashboard/resumen/')
      .then((res) => setResumen(res.data?.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const actividad = resumen?.actividad_reciente || [];

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Dashboard</span>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {[
          { label: 'Total Atractivos', value: resumen?.total_atractivos, icono: 'map', borde: 'border-l-primary', iconoBg: 'bg-primary-fixed text-primary' },
          { label: 'Proyectos Activos', value: resumen?.total_proyectos, icono: 'science', borde: 'border-l-secondary', iconoBg: 'bg-secondary-container text-secondary' },
          { label: 'Usuarios Registrados', value: resumen?.total_usuarios, icono: 'group', borde: 'border-l-success', iconoBg: 'bg-on-tertiary-container text-tertiary-container' },
          { label: 'Alertas Pendientes', value: resumen?.total_alertas, icono: 'warning', borde: 'border-l-error', iconoBg: 'bg-error-container text-error' },
        ].map((card, i) => (
          <div key={i} className={`bg-surface p-lg rounded-xl border border-outline-variant transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg ${card.borde} border-l-4`}>
            <div className="flex justify-between items-start mb-md">
              <div className={`p-sm ${card.iconoBg} rounded-lg`}><span className="material-symbols-outlined">{card.icono}</span></div>
            </div>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">{card.label}</h3>
            <p className="font-headline-md text-headline-md font-bold text-on-surface">
              {loading ? <span className="animate-pulse text-on-surface-variant">—</span> : (card.value ?? 0)}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant overflow-hidden flex flex-col">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Estado General del Sistema</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Monitoreo en tiempo real de infraestructura turística</p>
            </div>
            <button className="text-primary font-label-md text-label-md flex items-center gap-xs">Ver detalles <span className="material-symbols-outlined text-[18px]">open_in_new</span></button>
          </div>
          <div className="p-lg flex-1 min-h-[300px] relative bg-surface-container-low flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="z-10 text-center">
              <div className="inline-flex items-center gap-sm px-md py-sm bg-surface rounded-full shadow-sm border border-outline-variant mb-lg">
                <span className="w-3 h-3 bg-success rounded-full animate-pulse"></span>
                <span className="font-label-md text-label-md font-bold">Todos los servicios operando normalmente</span>
              </div>
              <div className="grid grid-cols-3 gap-xl max-w-lg mx-auto">
                {[
                  { pct: '94%', color: 'border-primary', textColor: 'text-primary', label: 'Infraestructura' },
                  { pct: '100%', color: 'border-success', textColor: 'text-success', label: 'Disponibilidad' },
                  { pct: '82%', color: 'border-warning', textColor: 'text-warning', label: 'Validación Datos' },
                ].map((ring, i) => (
                  <div key={i} className="text-center">
                    <div className={`w-24 h-24 rounded-full border-4 ${ring.color} border-t-transparent mx-auto mb-sm flex items-center justify-center`}>
                      <span className={`font-bold ${ring.textColor} text-headline-sm`}>{ring.pct}</span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{ring.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-outline-variant p-lg flex flex-col gap-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Acciones Rápidas</h2>
          <div className="flex flex-col gap-md">
            <Link to="/admin/atractivos" className="w-full inline-flex items-center justify-between p-md bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
              <span className="flex items-center gap-md"><span className="material-symbols-outlined">visibility</span>Ver Atractivos</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/explorador" className="w-full inline-flex items-center justify-between p-md bg-success text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
              <span className="flex items-center gap-md"><span className="material-symbols-outlined">explore</span>Ver Mapa Interactivo</span>
              <span className="material-symbols-outlined">map</span>
            </Link>
            <Link to="/admin/reportes" className="w-full inline-flex items-center justify-between p-md bg-warning text-white rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
              <span className="flex items-center gap-md"><span className="material-symbols-outlined">bar_chart</span>Ver Reportes</span>
              <span className="material-symbols-outlined">bar_chart</span>
            </Link>
          </div>
          <div className="mt-auto pt-lg border-t border-outline-variant">
            <div className="bg-surface-container-low p-md rounded-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-sm uppercase tracking-wider font-bold">Estado del Servidor</p>
              <div className="flex items-center gap-sm">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="font-body-md text-body-md">Sincronizado: hace 2 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Actividad Reciente</h2>
          <button className="p-2 rounded-lg hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low sticky top-0">
              <tr>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Usuario</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acción</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Recurso</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Fecha</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {actividad.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-lg py-md text-center text-on-surface-variant font-body-md">
                    <span className="material-symbols-outlined text-[32px] block mb-sm">history</span>
                    {loading ? 'Cargando...' : 'No hay actividad reciente registrada'}
                  </td>
                </tr>
              ) : (
                actividad.map((ev, i) => {
                  const estado = ESTADO_INFO[ev.accion] || { label: ev.accion || '—', clase: 'bg-tertiary-container text-on-tertiary-container', icono: null };
                  return (
                    <tr key={ev.id || i} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[12px]">{getInitials(ev.usuario_nombre)}</div>
                          <span className="font-table-data text-table-data font-medium">{ev.usuario_nombre || '—'}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md font-table-data text-table-data capitalize">{ev.accion?.toLowerCase() === 'creacion' ? 'Creación' : ev.accion?.toLowerCase() === 'modificacion' ? 'Modificación' : ev.accion?.toLowerCase() === 'eliminacion' ? 'Eliminación' : ev.accion || '—'}</td>
                      <td className="px-lg py-md font-table-data text-table-data">{ev.atractivo_nombre || ev.descripcion || '—'}</td>
                      <td className="px-lg py-md font-table-data text-table-data text-on-surface-variant">{ev.fecha || ''}</td>
                      <td className="px-lg py-md">
                        <span className={`px-2 py-1 ${estado.clase} rounded-full font-badge text-badge inline-flex items-center gap-xs`}>
                          {estado.icono && <span className="material-symbols-outlined text-[14px]">{estado.icono}</span>}
                          {estado.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
