import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/httpClient';

export default function EditarAtractivo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', descripcion: '', nivel_accesibilidad: 'LIBRE',
    estado_conservacion: 'CONSERVADO', referencia: '', latitud: '', longitud: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/atractivos/atractivos/${id}/`)
      .then(r => {
        const a = r.data.data || r.data;
        const ubi = a.ubicacion || {};
        const dir = ubi.direccion || {};
        setForm({
          nombre: a.nombre || '',
          descripcion: a.descripcion || '',
          nivel_accesibilidad: a.nivel_accesibilidad || 'LIBRE',
          estado_conservacion: a.estado_conservacion || 'CONSERVADO',
          referencia: dir.referencia || '',
          latitud: ubi.latitud != null ? String(ubi.latitud) : '',
          longitud: ubi.longitud != null ? String(ubi.longitud) : '',
        });
      })
      .catch(() => alert('Error al cargar el atractivo'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        nivel_accesibilidad: form.nivel_accesibilidad,
        estado_conservacion: form.estado_conservacion,
        ubicacion: {
          latitud: parseFloat(form.latitud),
          longitud: parseFloat(form.longitud),
          direccion: { referencia: form.referencia },
        },
      };
      await api.put(`/atractivos/atractivos/${id}/`, payload);
      navigate(`/detalle-atractivo/${id}`);
    } catch (err) {
      console.error('Error al actualizar atractivo:', err);
      alert('Error al actualizar el atractivo. Verifica los datos e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/lista-atractivos" className="hover:text-primary">Atractivos</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Editar Atractivo</span>
      </nav>
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-outline-variant p-lg space-y-lg">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Editar Atractivo</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="md:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre del Atractivo <span className="text-danger">*</span></label>
              <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} required
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" rows="4" value={form.descripcion} onChange={handleChange}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nivel_accesibilidad">Accesibilidad <span className="text-danger">*</span></label>
              <select id="nivel_accesibilidad" name="nivel_accesibilidad" value={form.nivel_accesibilidad} onChange={handleChange} required
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none">
                <option value="LIBRE">Libre</option>
                <option value="RESTRINGIDO">Restringido</option>
                <option value="PAGADO">Pagado</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="estado_conservacion">Estado Conservación <span className="text-danger">*</span></label>
              <select id="estado_conservacion" name="estado_conservacion" value={form.estado_conservacion} onChange={handleChange} required
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none">
                <option value="CONSERVADO">Conservado</option>
                <option value="ALTERADO">Alterado</option>
                <option value="EN_DETERIORO">En deterioro</option>
                <option value="DETERIORADO">Deteriorado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="referencia">Dirección o Referencia</label>
              <textarea id="referencia" name="referencia" rows="2" value={form.referencia} onChange={handleChange}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="latitud">Latitud <span className="text-danger">*</span></label>
              <input id="latitud" name="latitud" type="number" step="any" value={form.latitud} onChange={handleChange} required
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="longitud">Longitud <span className="text-danger">*</span></label>
              <input id="longitud" name="longitud" type="number" step="any" value={form.longitud} onChange={handleChange} required
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
            </div>
          </div>
          <div className="flex gap-md pt-md border-t border-outline-variant">
            <button type="submit" disabled={submitting} className="px-xl py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={() => navigate(`/detalle-atractivo/${id}`)} className="px-xl py-3 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">Cancelar</button>
          </div>
        </form>
      </div>
    </>
  );
}
