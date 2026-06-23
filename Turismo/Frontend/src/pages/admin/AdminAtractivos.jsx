import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

const ESTADO_OPTS = ['BORRADOR', 'REVISION', 'PUBLICADO', 'ARCHIVADO'];

export default function AdminAtractivos() {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivelAccesibilidad, setNivelAccesibilidad] = useState('LIBRE');
  const [estadoConservacion, setEstadoConservacion] = useState('CONSERVADO');

  const cargarAtractivos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/atractivos/atractivos/');
      setAtractivos(res.data.data || []);
    } catch {
      setError('No se pudieron cargar los atractivos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarAtractivos(); }, []);

  const resetForm = () => {
    setNombre(''); setDescripcion(''); setNivelAccesibilidad('LIBRE');
    setEstadoConservacion('CONSERVADO'); setEditando(null);
  };

  const abrirEditar = (a) => {
    setNombre(a.nombre);
    setDescripcion(a.descripcion);
    setNivelAccesibilidad(a.nivel_accesibilidad);
    setEstadoConservacion(a.estado_conservacion);
    setEditando(a.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { nombre, descripcion, nivel_accesibilidad: nivelAccesibilidad, estado_conservacion: estadoConservacion };
      if (editando) {
        await api.put(`/atractivos/atractivos/${editando}/`, payload);
      } else {
        await api.post('/atractivos/atractivos/', payload);
      }
      resetForm();
      setShowForm(false);
      cargarAtractivos();
    } catch {
      alert('Error al guardar el atractivo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, nombreA) => {
    if (!confirm(`¿Eliminar el atractivo "${nombreA}"?`)) return;
    try {
      await api.delete(`/atractivos/atractivos/${id}/`);
      cargarAtractivos();
    } catch {
      alert('No se pudo eliminar el atractivo.');
    }
  };

  const cambiarEstado = async (id, accion) => {
    try {
      await api.post(`/atractivos/atractivos/${id}/${accion}/`);
      cargarAtractivos();
    } catch {
      alert('Error al cambiar el estado.');
    }
  };

  const estadoLabel = {
    CONSERVADO: 'Conservado', ALTERADO: 'Alterado',
    EN_DETERIORO: 'En deterioro', DETERIORADO: 'Deteriorado',
  };

  const accesibilidadLabel = {
    LIBRE: 'Libre', RESTRINGIDO: 'Restringido', PAGADO: 'Pagado',
  };

  const estadoBadge = (est) => {
    const cls = est === 'PUBLICADO' ? 'bg-success/20 text-success' :
                est === 'BORRADOR' ? 'bg-warning/20 text-warning' :
                est === 'REVISION' ? 'bg-primary/20 text-primary' : 'bg-surface-container-low text-on-surface-variant';
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${cls}`}>{est}</span>;
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/atractivos" onClick={() => { setShowForm(false); resetForm(); }} className="hover:text-primary">Gestión de Atractivos</Link>
        {showForm && (<><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="font-bold text-on-surface">{editando ? 'Editar' : 'Nuevo'} Atractivo</span></>)}
      </nav>

      {showForm ? (
        <div className="bg-surface rounded-xl border border-outline-variant p-lg max-w-[600px] mx-auto shadow-sm">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">{editando ? 'Editar' : 'Agregar'} Atractivo Turístico</h2>
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre <span className="text-danger">*</span></label>
              <input id="nombre" required type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Parque Nacional Podocarpus"
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del atractivo..." rows="3"
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="accesibilidad">Nivel de Accesibilidad <span className="text-danger">*</span></label>
              <select id="accesibilidad" required value={nivelAccesibilidad} onChange={(e) => setNivelAccesibilidad(e.target.value)}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                <option value="LIBRE">Libre</option>
                <option value="RESTRINGIDO">Restringido</option>
                <option value="PAGADO">Pagado</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="conservacion">Estado de Conservación <span className="text-danger">*</span></label>
              <select id="conservacion" required value={estadoConservacion} onChange={(e) => setEstadoConservacion(e.target.value)}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                <option value="CONSERVADO">Conservado</option>
                <option value="ALTERADO">Alterado</option>
                <option value="EN_DETERIORO">En deterioro</option>
                <option value="DETERIORADO">Deteriorado</option>
              </select>
            </div>
            <div className="space-y-md">
              <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
                {submitting ? 'Guardando...' : (editando ? 'Actualizar Atractivo' : 'Guardar Atractivo')}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                className="w-full py-3 border border-outline-variant text-on-surface rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-all flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>Volver
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Atractivos Turísticos</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Total: {atractivos.length} registros</p>
            </div>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
              <span className="material-symbols-outlined">add</span>Nuevo Atractivo
            </button>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low sticky top-0">
                  <tr>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">ID</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Nombre</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Accesibilidad</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Estado</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Estado Pub.</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr><td colSpan="6" className="px-lg py-md text-center text-on-surface-variant font-body-md">Cargando...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="6" className="px-lg py-md text-center text-danger font-body-md">{error}</td></tr>
                  ) : atractivos.length === 0 ? (
                    <tr><td colSpan="6" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay atractivos registrados</td></tr>
                  ) : atractivos.map((a) => (
                    <tr key={a.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{a.id}</td>
                      <td className="px-lg py-md font-body-md text-on-surface font-medium">{a.nombre}</td>
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{accesibilidadLabel[a.nivel_accesibilidad] || a.nivel_accesibilidad}</td>
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{estadoLabel[a.estado_conservacion] || a.estado_conservacion}</td>
                      <td className="px-lg py-md">{estadoBadge(a.estado)}</td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button onClick={() => abrirEditar(a)}
                            className="inline-flex items-center gap-xs px-md py-1 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary-fixed transition-all">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          {a.estado !== 'PUBLICADO' && (
                            <button onClick={() => cambiarEstado(a.id, 'publicar')}
                              className="inline-flex items-center gap-xs px-md py-1 text-success border border-success/30 rounded-lg text-sm hover:bg-success/10 transition-all">
                              <span className="material-symbols-outlined text-[16px]">publish</span>
                            </button>
                          )}
                          {a.estado !== 'ARCHIVADO' && (
                            <button onClick={() => cambiarEstado(a.id, 'archivar')}
                              className="inline-flex items-center gap-xs px-md py-1 text-warning border border-warning/30 rounded-lg text-sm hover:bg-warning/10 transition-all">
                              <span className="material-symbols-outlined text-[16px]">archive</span>
                            </button>
                          )}
                          <button onClick={() => handleEliminar(a.id, a.nombre)}
                            className="inline-flex items-center gap-xs px-md py-1 text-danger border border-danger/30 rounded-lg text-sm hover:bg-error-container transition-all">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
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
