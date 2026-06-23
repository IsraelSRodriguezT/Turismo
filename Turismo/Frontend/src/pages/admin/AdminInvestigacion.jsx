import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function AdminInvestigacion() {
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [sector, setSector] = useState('');

  const [proyectos, setProyectos] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [respProyectos, respSectores] = await Promise.all([
        api.get('/investigacion/proyectos/'),
        api.get('/geolocalizacion/sectores/'),
      ]);
      setProyectos(respProyectos.data.data || []);
      setSectores(respSectores.data.data || []);
    } catch {
      setError('No se pudieron cargar los proyectos de investigación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/investigacion/proyectos/', {
        titulo,
        descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        objetivo,
        sector: sector ? Number(sector) : null,
      });
      setTitulo('');
      setDescripcion('');
      setFechaInicio('');
      setFechaFin('');
      setObjetivo('');
      setSector('');
      setShowForm(false);
      cargarDatos();
    } catch {
      alert('Error al guardar el proyecto. Verifique los datos.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, tituloP) => {
    if (!confirm(`¿Eliminar el proyecto "${tituloP}"?`)) return;
    try {
      await api.delete(`/investigacion/proyectos/${id}/`);
      cargarDatos();
    } catch {
      alert('No se pudo eliminar el proyecto.');
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/investigacion" onClick={() => setShowForm(false)} className="hover:text-primary">Investigación</Link>
        {showForm && (
          <>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-bold text-on-surface">Nuevo Proyecto</span>
          </>
        )}
      </nav>

      {showForm ? (
        <div className="bg-surface rounded-xl border border-outline-variant p-lg max-w-[600px] mx-auto shadow-sm">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">Agregar Proyecto de Investigación</h2>
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="titulo">
                Título del Proyecto <span className="text-danger">*</span>
              </label>
              <input
                id="titulo"
                required
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Análisis de Flora Urbana"
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="descripcion">
                Descripción <span className="text-danger">*</span>
              </label>
              <textarea
                id="descripcion"
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalle del proyecto..."
                rows="3"
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="fechaInicio">
                  Fecha de Inicio <span className="text-danger">*</span>
                </label>
                <input
                  id="fechaInicio"
                  required
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="fechaFin">
                  Fecha de Fin <span className="text-danger">*</span>
                </label>
                <input
                  id="fechaFin"
                  required
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="objetivo">
                Objetivo Principal <span className="text-danger">*</span>
              </label>
              <textarea
                id="objetivo"
                required
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Objetivo del proyecto..."
                rows="2"
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="sector">
                Sector Geográfico
              </label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
              >
                <option value="">Seleccione un sector</option>
                {sectores.map((sec) => (
                  <option key={sec.id} value={sec.id}>{sec.nombre}</option>
                ))}
              </select>
            </div>
            <div className="space-y-md">
              <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
                {submitting ? 'Guardando...' : 'Guardar Proyecto'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="w-full py-3 border border-outline-variant text-on-surface rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-all flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Volver
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Proyectos de Investigación</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Total: {proyectos.length} registros</p>
            </div>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
              <span className="material-symbols-outlined">add</span>Nuevo Proyecto
            </button>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low sticky top-0">
                  <tr>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">ID</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Título</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Fecha Inicio</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Fecha Fin</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr><td colSpan="5" className="px-lg py-md text-center text-on-surface-variant font-body-md">Cargando...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="5" className="px-lg py-md text-center text-danger font-body-md">{error}</td></tr>
                  ) : proyectos.length === 0 ? (
                    <tr><td colSpan="5" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay proyectos registrados</td></tr>
                  ) : proyectos.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{p.id}</td>
                      <td className="px-lg py-md font-body-md text-on-surface font-medium">{p.titulo}</td>
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{p.fecha_inicio}</td>
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{p.fecha_fin}</td>
                      <td className="px-lg py-md">
                        <button onClick={() => handleEliminar(p.id, p.titulo)}
                          className="inline-flex items-center gap-xs px-md py-1 text-danger border border-danger/30 rounded-lg text-sm hover:bg-error-container transition-all">
                          <span className="material-symbols-outlined text-[16px]">delete</span>Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
