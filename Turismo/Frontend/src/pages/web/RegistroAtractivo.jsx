import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/httpClient';

export default function RegistroAtractivo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', descripcion: '', nivel_accesibilidad: 'LIBRE',
    estado_conservacion: 'CONSERVADO', provincia: '', canton: '',
    referencia: '', latitud: '', longitud: '',
  });
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [recursosDisponibles, setRecursosDisponibles] = useState([]);
  const [recursosSeleccionados, setRecursosSeleccionados] = useState([]);

  useEffect(() => {
    api.get('/geolocalizacion/provincias/')
      .then(r => setProvincias(r.data.data || []))
      .catch(err => console.error('Error al cargar provincias:', err?.response?.status, err?.message));
    api.get('/inventario/recursos/?sin_atractivo=true')
      .then(r => setRecursosDisponibles(r.data.data || []))
      .catch(err => console.error('Error al cargar recursos:', err?.response?.status, err?.message));
  }, []);

  useEffect(() => {
    if (form.provincia) {
      api.get(`/geolocalizacion/cantones/?provincia=${form.provincia}`)
        .then(r => setCantones(r.data.data || []))
        .catch(err => console.error('Error al cargar cantones:', err?.response?.status, err?.response?.data, err?.message));
    } else {
      setCantones([]);
    }
  }, [form.provincia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, esBorrador = false) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        nivel_accesibilidad: form.nivel_accesibilidad,
        estado_conservacion: form.estado_conservacion,
        estado: esBorrador ? 'BORRADOR' : 'PUBLICADO',
        ubicacion: {
          latitud: parseFloat(form.latitud),
          longitud: parseFloat(form.longitud),
          direccion: { referencia: form.referencia },
        },
      };
      const res = await api.post('/atractivos/atractivos/', payload);
      const atractivoId = res.data?.data?.id;

      if (atractivoId) {
        for (const archivo of archivos) {
          const formData = new FormData();
          formData.append('archivo', archivo);
          formData.append('titulo', archivo.name);
          formData.append('tipo_recurso', archivo.type.startsWith('image/') ? 'IMAGEN' : 'DOCUMENTO');
          formData.append('atractivo_turistico', atractivoId);
          await api.post('/inventario/recursos/', formData);
        }
        for (const recursoId of recursosSeleccionados) {
          await api.patch(`/inventario/recursos/${recursoId}/`, { atractivo_turistico: atractivoId });
        }
      }
      navigate('/lista-atractivos');
    } catch (err) {
      console.error('Error al registrar atractivo:', err);
      alert('Error al guardar el atractivo. Verifica los datos e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Registro de Atractivo</span>
      </nav>
      <div className="max-w-3xl">
        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-surface rounded-xl border border-outline-variant p-lg space-y-lg">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Registrar Nuevo Atractivo</h1>
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
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="provincia">Provincia</label>
              <select id="provincia" name="provincia" value={form.provincia} onChange={handleChange}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none">
                <option value="">Seleccione provincia</option>
                {provincias.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="canton">Cantón</label>
              <select id="canton" name="canton" value={form.canton} onChange={handleChange}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none">
                <option value="">Seleccione cantón</option>
                {cantones.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
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
            <div className="md:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Adjuntar Imágenes / Documentos</label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-md text-center hover:border-primary transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setArchivos(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <span className="material-symbols-outlined text-[36px] text-on-surface-variant">cloud_upload</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Arrastra archivos o haz clic para adjuntar</p>
                <input id="file-upload" type="file" multiple className="hidden"
                  onChange={(e) => setArchivos(prev => [...prev, ...Array.from(e.target.files)])}
                />
              </div>
              {archivos.length > 0 && (
                <div className="flex flex-wrap gap-sm mt-sm">
                  {archivos.map((f, i) => (
                    <div key={i} className="flex items-center gap-sm px-3 py-1.5 bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{f.name}</span>
                      <button type="button" onClick={() => setArchivos(prev => prev.filter((_, j) => j !== i))}
                        className="text-on-surface-variant hover:text-danger">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {recursosDisponibles.length > 0 && (
              <div className="md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Recursos Importados</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  {recursosDisponibles.map(r => (
                    <label key={r.id} className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-colors ${recursosSeleccionados.includes(r.id) ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-outline'}`}>
                      <input type="checkbox" checked={recursosSeleccionados.includes(r.id)}
                        onChange={(e) => {
                          setRecursosSeleccionados(prev =>
                            e.target.checked ? [...prev, r.id] : prev.filter(id => id !== r.id)
                          );
                        }}
                        className="accent-primary w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <p className="font-label-md text-label-md text-on-surface truncate">{r.titulo}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{r.tipo_recurso}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-md pt-md border-t border-outline-variant">
            <button type="submit" disabled={submitting} className="px-xl py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
              {submitting ? 'Guardando...' : 'Publicar Atractivo'}
            </button>
            <button type="button" disabled={submitting} onClick={(e) => handleSubmit(e, true)} className="px-xl py-3 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all disabled:opacity-50">
              Guardar Borrador
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-xl py-3 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all text-center">Volver</button>
          </div>
        </form>
      </div>
    </>
  );
}
