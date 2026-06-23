import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function AdminProvincias() {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [respProvincias, respPaises] = await Promise.all([
        api.get('/geolocalizacion/provincias/'),
        api.get('/geolocalizacion/paises/'),
      ]);
      setProvincias(respProvincias.data.data || []);
      setPaises(respPaises.data.data || []);
    } catch {
      setError('No se pudieron cargar las provincias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/geolocalizacion/provincias/', { nombre, pais_id: Number(pais) });
      setNombre('');
      setPais('');
      setShowForm(false);
      cargarDatos();
    } catch {
      alert('Error al guardar la provincia. Verifique que no esté duplicada.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, nombreP) => {
    if (!confirm(`¿Eliminar la provincia "${nombreP}"?`)) return;
    try {
      await api.delete(`/geolocalizacion/provincias/${id}/`);
      cargarDatos();
    } catch {
      alert('No se pudo eliminar la provincia.');
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/provincias" onClick={() => setShowForm(false)} className="hover:text-primary">Gestión de Provincias</Link>
        {showForm && (<><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="font-bold text-on-surface">Nueva Provincia</span></>)}
      </nav>

      {showForm ? (
        <div className="bg-surface rounded-xl border border-outline-variant p-lg max-w-[600px] mx-auto shadow-sm">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">Agregar Provincia</h2>
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre de la Provincia <span className="text-danger">*</span></label>
              <input id="nombre" required type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Loja"
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="pais">País <span className="text-danger">*</span></label>
              <select id="pais" required value={pais} onChange={(e) => setPais(e.target.value)}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                <option value="">Seleccione un país</option>
                {paises.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-md">
              <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
                {submitting ? 'Guardando...' : 'Guardar Provincia'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
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
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Provincias</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Total: {provincias.length} registros</p>
            </div>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
              <span className="material-symbols-outlined">add</span>Nueva Provincia
            </button>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low sticky top-0">
                  <tr>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">ID</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Nombre</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">País</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">Cargando...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="4" className="px-lg py-md text-center text-danger font-body-md">{error}</td></tr>
                  ) : provincias.length === 0 ? (
                    <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay provincias registradas</td></tr>
                  ) : provincias.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{p.id}</td>
                      <td className="px-lg py-md font-body-md text-on-surface font-medium">{p.nombre}</td>
                      <td className="px-lg py-md font-body-md text-on-surface-variant">{p.pais?.nombre || p.pais}</td>
                      <td className="px-lg py-md">
                        <button onClick={() => handleEliminar(p.id, p.nombre)}
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
