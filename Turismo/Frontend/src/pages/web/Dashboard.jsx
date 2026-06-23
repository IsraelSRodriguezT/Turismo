import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const actividadReciente = [];

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Dashboard</span>
      </nav>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <div className="bg-surface p-lg rounded-xl border border-outline-variant hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary-fixed text-primary rounded-lg"><span className="material-symbols-outlined">map</span></div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Atractivos</h3>
          <p className="font-headline-md text-headline-md font-bold text-on-surface" id="totalAtractivos">0</p>
        </div>
        <div className="bg-surface p-lg rounded-xl border border-outline-variant hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-secondary-container text-secondary rounded-lg"><span className="material-symbols-outlined">science</span></div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Proyectos Activos</h3>
          <p className="font-headline-md text-headline-md font-bold text-on-surface" id="totalProyectos">0</p>
        </div>
        <div className="bg-surface p-lg rounded-xl border border-outline-variant hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow border-l-4 border-l-success">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-on-tertiary-container text-tertiary-container rounded-lg"><span className="material-symbols-outlined">group</span></div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Usuarios Registrados</h3>
          <p className="font-headline-md text-headline-md font-bold text-on-surface" id="totalUsuarios">0</p>
        </div>
        <div className="bg-surface p-lg rounded-xl border border-outline-variant hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow border-l-4 border-l-error">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-error-container text-error rounded-lg"><span className="material-symbols-outlined">warning</span></div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Alertas Pendientes</h3>
          <p className="font-headline-md text-headline-md font-bold text-on-surface" id="totalAlertas">0</p>
        </div>
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
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent mx-auto mb-sm flex items-center justify-center">
                    <span className="font-bold text-primary text-headline-sm" id="infraestructuraPct">94%</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Infraestructura</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-success border-t-transparent mx-auto mb-sm flex items-center justify-center">
                    <span className="font-bold text-success text-headline-sm" id="disponibilidadPct">100%</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Disponibilidad</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-warning border-t-transparent mx-auto mb-sm flex items-center justify-center">
                    <span className="font-bold text-warning text-headline-sm" id="validacionPct">82%</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Validación Datos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-outline-variant p-lg flex flex-col gap-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Acciones Rápidas</h2>
          <div className="flex flex-col gap-md">
            <Link to="/registro-atractivo" className="w-full inline-flex items-center justify-between p-md bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
              <span className="flex items-center gap-md"><span className="material-symbols-outlined">add_location</span>Registrar Atractivo</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/explorador" className="w-full inline-flex items-center justify-between p-md bg-success text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
              <span className="flex items-center gap-md"><span className="material-symbols-outlined">explore</span>Ver Mapa Interactivo</span>
              <span className="material-symbols-outlined">map</span>
            </Link>
            <Link to="/admin/reportes" className="w-full inline-flex items-center justify-between p-md border border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors">
              <span className="flex items-center gap-md"><span className="material-symbols-outlined">description</span>Reporte y Estadísticas</span>
              <span className="material-symbols-outlined">download</span>
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
              {actividadReciente.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-lg py-md text-center text-on-surface-variant font-body-md">
                    <span className="material-symbols-outlined text-[32px] block mb-sm">history</span>
                    No hay actividad reciente registrada
                  </td>
                </tr>
              ) : (
                actividadReciente.map((ev, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[12px]">{ev.initials || '--'}</div>
                        <span className="font-table-data text-table-data font-medium">{ev.usuario || 'Usuario'}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md font-table-data text-table-data">{ev.accion || 'Acción'}</td>
                    <td className="px-lg py-md font-table-data text-table-data">{ev.recurso || 'Recurso'}</td>
                    <td className="px-lg py-md font-table-data text-table-data text-on-surface-variant">{ev.fecha || ''}</td>
                    <td className="px-lg py-md">
                      <span className={`px-2 py-1 ${ev.estado_clase || 'bg-tertiary-container text-on-tertiary-container'} rounded-full font-badge text-badge inline-flex items-center gap-xs`}>
                        {ev.icono && <span className="material-symbols-outlined text-[14px]">{ev.icono}</span>}
                        {ev.estado || '—'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
