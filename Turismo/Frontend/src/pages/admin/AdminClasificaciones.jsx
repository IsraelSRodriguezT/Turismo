import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function AdminClasificaciones() {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('CATEGORIA');
  const [editando, setEditando] = useState(null);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/atractivos/clasificaciones/');
      setClasificaciones(resp.data.data || []);
    } catch {
      setError('No se pudieron cargar las clasificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const resetForm = () => {
    setNombre(''); setDescripcion(''); setNivel('CATEGORIA'); setEditando(null);
  };
  const cerrarForm = () => { resetForm(); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { nombre, descripcion, nivel };
      if (editando) {
        await api.put(`/atractivos/clasificaciones/${editando}/`, payload);
      } else {
        await api.post('/atractivos/clasificaciones/', payload);
      }
      resetForm();
      setShowForm(false);
      cargarDatos();
    } catch {
      alert('Error al guardar la clasificación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, nombreC) => {
    if (!confirm(`¿Eliminar la clasificación "${nombreC}"?`)) return;
    try {
      await api.delete(`/atractivos/clasificaciones/${id}/`);
      cargarDatos();
    } catch {
      alert('No se pudo eliminar la clasificación.');
    }
  };

  const handleEditar = (c) => {
    setNombre(c.nombre);
    setDescripcion(c.descripcion || '');
    setNivel(c.nivel);
    setEditando(c.id);
    setShowForm(true);
  };

  const nivelLabel = { CATEGORIA: 'Categoría', TIPO: 'Tipo', SUBTIPO: 'Subtipo' };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/clasificaciones" onClick={() => { setShowForm(false); resetForm(); }} className="hover:text-primary">Gestión de Clasificaciones</Link>
        {showForm && (<><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="font-bold text-on-surface">{editando ? 'Editar' : 'Agregar'} Clasificación</span></>)}
      </nav>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 overflow-y-auto py-4">
          <div className="w-full max-w-lg mx-4 bg-surface rounded-xl border border-outline-variant shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editando ? 'Editar Clasificación' : 'Agregar Clasificación'}
              </h3>
              <button type="button" onClick={cerrarForm}
                className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-lg space-y-lg">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre de la Clasificación <span className="text-danger">*</span></label>
                <input id="nombre" required type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Patrimonial"
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve descripción..." rows="3"
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nivel">Nivel <span className="text-danger">*</span></label>
                <select id="nivel" required value={nivel} onChange={(e) => setNivel(e.target.value)}
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                  <option value="CATEGORIA">Categoría</option>
                  <option value="TIPO">Tipo</option>
                  <option value="SUBTIPO">Subtipo</option>
                </select>
              </div>
              <div className="flex gap-md pt-4 border-t border-outline-variant">
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
                  {submitting ? 'Guardando...' : (editando ? 'Guardar Cambios' : 'Guardar')}
                </button>
                <button type="button" onClick={cerrarForm}
                  className="flex-1 py-3 border border-outline-variant text-on-surface rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listado */}
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Clasificaciones</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: {clasificaciones.length} registros</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
          <span className="material-symbols-outlined">add</span>Agregar Clasificación
        </button>
      </div>
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low sticky top-0">
              <tr>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">ID</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Nombre</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Nivel</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan="4" className="px-lg py-md text-center text-danger font-body-md">{error}</td></tr>
              ) : clasificaciones.length === 0 ? (
                <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay clasificaciones registradas</td></tr>
              ) : clasificaciones.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-lg py-md font-body-md text-on-surface-variant">{c.id}</td>
                  <td className="px-lg py-md font-body-md text-on-surface font-medium">{c.nombre}</td>
                  <td className="px-lg py-md font-body-md text-on-surface-variant">{nivelLabel[c.nivel] || c.nivel}</td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditar(c)}
                        className="inline-flex items-center gap-xs px-md py-1 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary-fixed transition-all">
                        <span className="material-symbols-outlined text-[16px]">edit</span>Editar
                      </button>
                      <button onClick={() => handleEliminar(c.id, c.nombre)}
                        className="inline-flex items-center gap-xs px-md py-1 text-danger border border-danger/30 rounded-lg text-sm hover:bg-error-container transition-all">
                        <span className="material-symbols-outlined text-[16px]">delete</span>Eliminar
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
  );
}
