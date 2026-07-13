import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

const tipoHorarioOptions = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'FIN_SEMANA', label: 'Fin de semana' },
  { value: 'FERIADO', label: 'Feriado' },
  { value: 'ESPECIAL', label: 'Especial' },
];

export default function AdminAtractivos() {
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivelAccesibilidad, setNivelAccesibilidad] = useState('LIBRE');
  const [estadoConservacion, setEstadoConservacion] = useState('CONSERVADO');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [altitud, setAltitud] = useState('');
  const [callePrincipal, setCallePrincipal] = useState('');
  const [calleTransversal, setCalleTransversal] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [clima, setClima] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [precipMin, setPrecipMin] = useState('');
  const [precipMax, setPrecipMax] = useState('');

  const [errores, setErrores] = useState({});

  const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', descripcion: '', costo: '', esta_disponible: true });
  const [serviciosNuevos, setServiciosNuevos] = useState([]);
  const [serviciosExistentes, setServiciosExistentes] = useState([]);
  const [serviciosAEliminar, setServiciosAEliminar] = useState([]);
  const [errorServicio, setErrorServicio] = useState('');

  const [nuevoHorario, setNuevoHorario] = useState({ tipo_horario: 'NORMAL', hora_inicio: '', hora_fin: '' });
  const [horariosNuevos, setHorariosNuevos] = useState([]);
  const [horariosExistentes, setHorariosExistentes] = useState([]);
  const [horariosAEliminar, setHorariosAEliminar] = useState([]);
  const [errorHorario, setErrorHorario] = useState('');

  const [nuevoRecurso, setNuevoRecurso] = useState({ titulo: '', descripcion: '', tipo_recurso: 'IMAGEN', archivo: null });
  const [recursosNuevos, setRecursosNuevos] = useState([]);
  const [recursosExistentes, setRecursosExistentes] = useState([]);
  const [recursosAEliminar, setRecursosAEliminar] = useState([]);
  const [errorRecurso, setErrorRecurso] = useState('');

  const [sectoresDisponibles, setSectoresDisponibles] = useState([]);
  const [sectorId, setSectorId] = useState('');

  const [clasificacionesDisponibles, setClasificacionesDisponibles] = useState([]);
  const [clasificacionesSeleccionadas, setClasificacionesSeleccionadas] = useState([]);
  const [rutasDisponibles, setRutasDisponibles] = useState([]);
  const [rutasSeleccionadas, setRutasSeleccionadas] = useState([]);
  const [pasoActual, setPasoActual] = useState(1);
  const [cardImageIndex, setCardImageIndex] = useState({});

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

  const cargarSectores = async () => {
    try {
      const res = await api.get('/geolocalizacion/sectores/');
      setSectoresDisponibles(res.data.data || []);
    } catch {}
  };

  const cargarClasificaciones = async () => {
    try {
      const res = await api.get('/atractivos/clasificaciones/');
      setClasificacionesDisponibles(res.data.data || []);
    } catch {}
  };

  const cargarRutas = async () => {
    try {
      const res = await api.get('/atractivos/rutas/');
      setRutasDisponibles(res.data.data || []);
    } catch {}
  };

  const openModal = async (atractivo = null) => {
    setModalError(null);
    await Promise.all([cargarSectores(), cargarClasificaciones(), cargarRutas()]);

    if (atractivo) {
      setEditando(atractivo.id);
      setNombre(atractivo.nombre || '');
      setDescripcion(atractivo.descripcion || '');
      setNivelAccesibilidad(atractivo.nivel_accesibilidad || 'LIBRE');
      setEstadoConservacion(atractivo.estado_conservacion || 'CONSERVADO');

      const ubi = atractivo.ubicacion || {};
      const dir = ubi.direccion || {};
      const clim = ubi.informacion_climatica || {};
      setLatitud(ubi.latitud != null ? String(ubi.latitud) : '');
      setLongitud(ubi.longitud != null ? String(ubi.longitud) : '');
      setAltitud(ubi.altitud != null ? String(ubi.altitud) : '');
      setCallePrincipal(dir.calle_principal || '');
      setCalleTransversal(dir.calle_transversal || '');
      setNumero(dir.numero || '');
      setReferencia(dir.referencia || '');
      setClima(clim.clima || '');
      setTempMin(clim.temperatura_minima != null ? String(clim.temperatura_minima) : '');
      setTempMax(clim.temperatura_maxima != null ? String(clim.temperatura_maxima) : '');
      setPrecipMin(clim.precipitacion_minima != null ? String(clim.precipitacion_minima) : '');
      setPrecipMax(clim.precipitacion_maxima != null ? String(clim.precipitacion_maxima) : '');

      setSectorId(atractivo.sector || '');
      setClasificacionesSeleccionadas((atractivo.clasificaciones || []).map(c => (typeof c === 'object' ? c.id : c)));
      const rutaIds = (atractivo.detalles_ruta || []).map(dr => dr.ruta);
      setRutasSeleccionadas(rutaIds);

      try {
        const resS = await api.get(`/atractivos/servicios/?atractivo_turistico=${atractivo.id}`);
        setServiciosExistentes(resS.data.data || []);
      } catch {}
      try {
        const resH = await api.get(`/atractivos/horarios/?atractivo_turistico=${atractivo.id}`);
        setHorariosExistentes(resH.data.data || []);
      } catch {}
      try {
        const resR = await api.get(`/inventario/recursos/?atractivo_turistico=${atractivo.id}`);
        setRecursosExistentes(resR.data.data || []);
      } catch {}

      setServiciosNuevos([]);
      setServiciosAEliminar([]);
      setHorariosNuevos([]);
      setHorariosAEliminar([]);
      setRecursosNuevos([]);
      setRecursosAEliminar([]);
    } else {
      resetForm();
    }
    setPasoActual(1);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditando(null);
    setNombre(''); setDescripcion('');
    setNivelAccesibilidad('LIBRE'); setEstadoConservacion('CONSERVADO');
    setLatitud(''); setLongitud(''); setAltitud('');
    setCallePrincipal(''); setCalleTransversal(''); setNumero(''); setReferencia('');
    setClima(''); setTempMin(''); setTempMax(''); setPrecipMin(''); setPrecipMax('');
    setSectorId('');
    setServiciosExistentes([]); setServiciosNuevos([]); setServiciosAEliminar([]);
    setHorariosExistentes([]); setHorariosNuevos([]); setHorariosAEliminar([]);
    setRecursosExistentes([]); setRecursosNuevos([]); setRecursosAEliminar([]);
    setClasificacionesSeleccionadas([]); setRutasSeleccionadas([]);
    setErrores({}); setErrorServicio(''); setErrorHorario(''); setErrorRecurso('');
    setPasoActual(1);
    setModalError(null);
  };

  const cerrarModal = () => {
    setShowModal(false);
    resetForm();
  };

  const agregarServicio = () => {
    if (!nuevoServicio.nombre.trim()) {
      setErrorServicio('El nombre del servicio es obligatorio.');
      return;
    }
    if (nuevoServicio.nombre.length > 255) {
      setErrorServicio('El nombre no puede exceder 255 caracteres.');
      return;
    }
    setErrorServicio('');
    setServiciosNuevos(prev => [...prev, { ...nuevoServicio, costo: parseFloat(nuevoServicio.costo) || 0 }]);
    setNuevoServicio({ nombre: '', descripcion: '', costo: '', esta_disponible: true });
  };

  const eliminarServicioExistente = (s) => {
    setServiciosExistentes(prev => prev.filter(x => x.id !== s.id));
    setServiciosAEliminar(prev => [...prev, s.id]);
  };

  const agregarHorario = () => {
    if (!nuevoHorario.hora_inicio || !nuevoHorario.hora_fin) {
      setErrorHorario('La hora de inicio y fin son obligatorias.');
      return;
    }
    setErrorHorario('');
    setHorariosNuevos(prev => [...prev, { ...nuevoHorario }]);
    setNuevoHorario({ tipo_horario: 'NORMAL', hora_inicio: '', hora_fin: '' });
  };

  const eliminarHorarioExistente = (h) => {
    setHorariosExistentes(prev => prev.filter(x => x.id !== h.id));
    setHorariosAEliminar(prev => [...prev, h.id]);
  };

  const agregarRecurso = () => {
    if (!nuevoRecurso.titulo.trim()) {
      setErrorRecurso('El título es obligatorio.');
      return;
    }
    if (nuevoRecurso.tipo_recurso === 'IMAGEN' && !nuevoRecurso.archivo) {
      setErrorRecurso('Debe seleccionar un archivo de imagen.');
      return;
    }
    setErrorRecurso('');
    setRecursosNuevos(prev => [...prev, { ...nuevoRecurso }]);
    setNuevoRecurso({ titulo: '', descripcion: '', tipo_recurso: 'IMAGEN', archivo: null });
  };

  const eliminarRecursoExistente = (r) => {
    setRecursosExistentes(prev => prev.filter(x => x.id !== r.id));
    setRecursosAEliminar(prev => [...prev, r.id]);
  };

  const toggleClasificacion = (id) => {
    setClasificacionesSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleRuta = (id) => {
    setRutasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const validarPaso = (paso) => {
    const e = {};
    if (paso === 1) {
      if (!nombre.trim()) e.nombre = 'El nombre es obligatorio.';
      else if (nombre.length > 255) e.nombre = 'El nombre no puede exceder 255 caracteres.';
      if (!sectorId) e.sector = 'Debe seleccionar un sector.';
    }
    if (paso === 2) {
      if (!latitud || isNaN(parseFloat(latitud)) || parseFloat(latitud) < -90 || parseFloat(latitud) > 90)
        e.latitud = 'Debe ser un número entre -90 y 90.';
      if (!longitud || isNaN(parseFloat(longitud)) || parseFloat(longitud) < -180 || parseFloat(longitud) > 180)
        e.longitud = 'Debe ser un número entre -180 y 180.';
      if (!altitud || isNaN(parseFloat(altitud)) || parseFloat(altitud) < 0 || parseFloat(altitud) > 9000)
        e.altitud = 'Debe ser un valor positivo entre 0 y 9000 msnm.';
      if (!callePrincipal.trim()) e.callePrincipal = 'La calle principal es obligatoria.';
      else if (callePrincipal.length > 255) e.callePrincipal = 'Máximo 255 caracteres.';
      if (!calleTransversal.trim()) e.calleTransversal = 'La calle transversal es obligatoria.';
      else if (calleTransversal.length > 255) e.calleTransversal = 'Máximo 255 caracteres.';
      if (!numero.trim()) e.numero = 'El número es obligatorio.';
      else if (numero.length > 50) e.numero = 'Máximo 50 caracteres.';
      if (!referencia.trim()) e.referencia = 'La referencia es obligatoria.';
      else if (referencia.length > 500) e.referencia = 'Máximo 500 caracteres.';
      if (!clima.trim()) e.clima = 'El tipo de clima es obligatorio.';
      else if (clima.length > 100) e.clima = 'Máximo 100 caracteres.';
      if (!tempMin || isNaN(parseInt(tempMin))) e.tempMin = 'La temperatura mínima es obligatoria.';
      else if (parseInt(tempMin) < 0) e.tempMin = 'Debe ser un valor positivo.';
      if (!tempMax || isNaN(parseInt(tempMax))) e.tempMax = 'La temperatura máxima es obligatoria.';
      else if (parseInt(tempMax) < 0) e.tempMax = 'Debe ser un valor positivo.';
      if (tempMin && tempMax && parseInt(tempMin) > parseInt(tempMax))
        e.tempMax = 'No puede ser menor que la temperatura mínima.';
      if (!precipMin || isNaN(parseInt(precipMin))) e.precipMin = 'La precipitación mínima es obligatoria.';
      else if (parseInt(precipMin) < 0) e.precipMin = 'Debe ser un valor positivo.';
      if (!precipMax || isNaN(parseInt(precipMax))) e.precipMax = 'La precipitación máxima es obligatoria.';
      else if (parseInt(precipMax) < 0) e.precipMax = 'Debe ser un valor positivo.';
      if (precipMin && precipMax && parseInt(precipMin) > parseInt(precipMax))
        e.precipMax = 'No puede ser menor que la precipitación mínima.';
    }
    if (paso === 3) {
      const totalHorarios = horariosExistentes.length + horariosNuevos.length;
      if (totalHorarios === 0) e.horarios = 'Debe agregar al menos un horario.';
    }
    if (paso === 4) {
      if (clasificacionesSeleccionadas.length === 0) e.clasificaciones = 'Debe seleccionar al menos una clasificación.';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const siguientePaso = () => {
    if (pasoActual < 4 && validarPaso(pasoActual)) setPasoActual(p => p + 1);
  };

  const anteriorPaso = () => {
    if (pasoActual > 1) { setPasoActual(p => p - 1); setErrores({}); }
  };

  const limpiarError = (campo) => {
    setErrores(prev => ({ ...prev, [campo]: undefined }));
  };

  const validarFormulario = () => {
    const e = {};

    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    else if (nombre.length > 255) e.nombre = 'El nombre no puede exceder 255 caracteres.';

    if (!sectorId) e.sector = 'Debe seleccionar un sector.';

    if (!latitud || isNaN(parseFloat(latitud)) || parseFloat(latitud) < -90 || parseFloat(latitud) > 90)
      e.latitud = 'Debe ser un número entre -90 y 90.';

    if (!longitud || isNaN(parseFloat(longitud)) || parseFloat(longitud) < -180 || parseFloat(longitud) > 180)
      e.longitud = 'Debe ser un número entre -180 y 180.';

    if (!altitud || isNaN(parseFloat(altitud)) || parseFloat(altitud) < 0 || parseFloat(altitud) > 9000)
      e.altitud = 'Debe ser un valor positivo entre 0 y 9000 msnm.';

    if (!callePrincipal.trim()) e.callePrincipal = 'La calle principal es obligatoria.';
    else if (callePrincipal.length > 255) e.callePrincipal = 'Máximo 255 caracteres.';
    if (!calleTransversal.trim()) e.calleTransversal = 'La calle transversal es obligatoria.';
    else if (calleTransversal.length > 255) e.calleTransversal = 'Máximo 255 caracteres.';
    if (!numero.trim()) e.numero = 'El número es obligatorio.';
    else if (numero.length > 50) e.numero = 'Máximo 50 caracteres.';
    if (!referencia.trim()) e.referencia = 'La referencia es obligatoria.';
    else if (referencia.length > 500) e.referencia = 'Máximo 500 caracteres.';
    if (!clima.trim()) e.clima = 'El tipo de clima es obligatorio.';
    else if (clima.length > 100) e.clima = 'Máximo 100 caracteres.';

    if (!tempMin || isNaN(parseInt(tempMin))) e.tempMin = 'La temperatura mínima es obligatoria.';
    else if (parseInt(tempMin) < 0) e.tempMin = 'Debe ser un valor positivo.';
    if (!tempMax || isNaN(parseInt(tempMax))) e.tempMax = 'La temperatura máxima es obligatoria.';
    else if (parseInt(tempMax) < 0) e.tempMax = 'Debe ser un valor positivo.';
    if (tempMin && tempMax && parseInt(tempMin) > parseInt(tempMax))
      e.tempMax = 'No puede ser menor que la temperatura mínima.';

    if (!precipMin || isNaN(parseInt(precipMin))) e.precipMin = 'La precipitación mínima es obligatoria.';
    else if (parseInt(precipMin) < 0) e.precipMin = 'Debe ser un valor positivo.';
    if (!precipMax || isNaN(parseInt(precipMax))) e.precipMax = 'La precipitación máxima es obligatoria.';
    else if (parseInt(precipMax) < 0) e.precipMax = 'Debe ser un valor positivo.';
    if (precipMin && precipMax && parseInt(precipMin) > parseInt(precipMax))
      e.precipMax = 'No puede ser menor que la precipitación mínima.';

    if (horariosExistentes.length + horariosNuevos.length === 0) e.horarios = 'Debe agregar al menos un horario.';

    if (clasificacionesSeleccionadas.length === 0) e.clasificaciones = 'Debe seleccionar al menos una clasificación.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setSubmitting(true);
    setModalError(null);
    try {
      const payload = {
        sector: sectorId || null,
        nombre,
        descripcion,
        nivel_accesibilidad: nivelAccesibilidad,
        estado_conservacion: estadoConservacion,
        ubicacion: {
          latitud: parseFloat(latitud),
          longitud: parseFloat(longitud),
          altitud: parseFloat(altitud),
          direccion: {
            calle_principal: callePrincipal,
            calle_transversal: calleTransversal,
            numero,
            referencia,
          },
          informacion_climatica: {
            clima,
            temperatura_minima: parseInt(tempMin),
            temperatura_maxima: parseInt(tempMax),
            precipitacion_minima: parseInt(precipMin),
            precipitacion_maxima: parseInt(precipMax),
          },
        },
        clasificaciones: clasificacionesSeleccionadas,
        rutas: rutasSeleccionadas,
      };

      let atractivoId;
      if (editando) {
        await api.put(`/atractivos/atractivos/${editando}/`, payload);
        atractivoId = editando;
      } else {
        const res = await api.post('/atractivos/atractivos/', payload);
        atractivoId = res.data?.data?.id;
      }

      if (atractivoId) {
        for (const sid of serviciosAEliminar) {
          await api.delete(`/atractivos/servicios/${sid}/`).catch(() => {});
        }
        for (const s of serviciosNuevos) {
          await api.post('/atractivos/servicios/', {
            nombre: s.nombre, descripcion: s.descripcion,
            costo: s.costo, esta_disponible: s.esta_disponible,
            atractivo_turistico: atractivoId,
          }).catch(() => {});
        }
        for (const hid of horariosAEliminar) {
          await api.delete(`/atractivos/horarios/${hid}/`).catch(() => {});
        }
        for (const h of horariosNuevos) {
          await api.post('/atractivos/horarios/', {
            tipo_horario: h.tipo_horario,
            hora_inicio: h.hora_inicio, hora_fin: h.hora_fin,
            atractivo_turistico: atractivoId,
          }).catch(() => {});
        }
        for (const rid of recursosAEliminar) {
          await api.delete(`/inventario/recursos/${rid}/`).catch(() => {});
        }
        for (const r of recursosNuevos) {
          const fd = new FormData();
          fd.append('titulo', r.titulo);
          fd.append('descripcion', r.descripcion);
          fd.append('tipo_recurso', r.tipo_recurso);
          fd.append('archivo', r.archivo);
          fd.append('atractivo_turistico', atractivoId);
          await api.post('/inventario/recursos/', fd);
        }
      }

      cerrarModal();
      cargarAtractivos();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error al guardar el atractivo.');
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

  const estadoLabel = {
    CONSERVADO: 'Conservado', ALTERADO: 'Alterado',
    EN_DETERIORO: 'En deterioro', DETERIORADO: 'Deteriorado',
  };

  const accesibilidadLabel = {
    LIBRE: 'Libre', RESTRINGIDO: 'Restringido', PAGADO: 'Pagado',
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/atractivos" className="hover:text-primary">Gestión de Atractivos</Link>
      </nav>

      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Atractivos Turísticos</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: {atractivos.length} registros</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
          <span className="material-symbols-outlined">add</span>Agregar Atractivo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md animate-spin">autorenew</span>
          <p className="font-body-lg text-body-lg">Cargando atractivos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-xl text-danger">
          <span className="material-symbols-outlined text-[48px] block mb-md">error</span>
          <p className="font-body-lg text-body-lg">{error}</p>
        </div>
      ) : atractivos.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md">landscape</span>
          <p className="font-body-lg text-body-lg">No hay atractivos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {atractivos.map((a) => (
              <div key={a.id} className="bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-md hover:border-primary transition-all group">
                {(() => {
                  const images = a.imagenes || [];
                  const currentIdx = cardImageIndex[a.id] || 0;
                  if (images.length > 0) {
                    return (
                      <div className="h-36 relative overflow-hidden group/image">
                        <img src={images[currentIdx]} alt={a.nombre} className="w-full h-full object-cover" />
                        {images.length > 1 && (
                          <>
                            {currentIdx > 0 && (
                              <button type="button" onClick={() => setCardImageIndex(prev => ({ ...prev, [a.id]: currentIdx - 1 }))}
                                className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/60">
                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                              </button>
                            )}
                            {currentIdx < images.length - 1 && (
                              <button type="button" onClick={() => setCardImageIndex(prev => ({ ...prev, [a.id]: currentIdx + 1 }))}
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-black/60">
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                              </button>
                            )}
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                              {images.map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-white scale-110' : 'bg-white/50'}`} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div className="h-36 bg-surface-container flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-[44px] text-on-surface-variant/40">landscape</span>
                    </div>
                  );
                })()}
              <div className="p-lg">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate mb-sm">{a.nombre}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md">{a.descripcion || 'Sin descripción'}</p>
                <div className="flex flex-wrap items-center gap-x-lg gap-y-1 mb-md text-sm text-on-surface-variant">
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">accessible</span>
                    {accesibilidadLabel[a.nivel_accesibilidad] || a.nivel_accesibilidad}
                  </span>
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">eco</span>
                    {estadoLabel[a.estado_conservacion] || a.estado_conservacion}
                  </span>
                </div>
                <div className="flex items-center gap-1 pt-md border-t border-outline-variant">
                  <button onClick={() => openModal(a)}
                    className="inline-flex items-center justify-center w-9 h-9 text-primary rounded-lg hover:bg-primary-fixed transition-all"
                    title="Editar">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleEliminar(a.id, a.nombre)}
                    className="inline-flex items-center justify-center w-9 h-9 text-danger rounded-lg hover:bg-error-container transition-all"
                    title="Eliminar">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === MODAL OVERLAY === */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 overflow-y-auto py-4"
        >
          <div
            className="w-full max-w-4xl mx-4 bg-surface rounded-xl border border-outline-variant shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editando ? 'Editar Atractivo' : 'Nuevo Atractivo'}
              </h3>
              <button onClick={cerrarModal}
                className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} onKeyDown={(e) => {
              if (e.key === 'Enter' && pasoActual < 4) { e.preventDefault(); siguientePaso(); }
            }} className="p-lg">
              {modalError && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-error-container text-on-error-container border-error/20 mb-md">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="font-body-md flex-1">{modalError}</p>
                </div>
              )}

              {/* === STEPPER === */}
              <div className="flex items-center gap-0 mb-lg px-1">
                {[
                  { num: 1, icon: 'info', label: 'General' },
                  { num: 2, icon: 'location_on', label: 'Ubicación' },
                  { num: 3, icon: 'room_service', label: 'Servicios' },
                  { num: 4, icon: 'category', label: 'Clasificación' },
                ].map((step, i) => (
                  <React.Fragment key={step.num}>
                    <button type="button" onClick={() => { if (step.num <= pasoActual) { setErrores({}); setPasoActual(step.num); } else if (validarPaso(pasoActual)) setPasoActual(step.num); }}
                      className="flex flex-col items-center gap-1 group">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-sm font-bold
                        ${pasoActual === step.num ? 'bg-primary text-on-primary shadow-md' :
                          pasoActual > step.num ? 'bg-success text-on-primary' :
                          'bg-surface-container-low text-on-surface-variant border border-outline-variant'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {pasoActual > step.num ? 'check' : step.icon}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium whitespace-nowrap ${pasoActual === step.num ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {step.label}
                      </span>
                    </button>
                    {i < 3 && (
                      <div className={`flex-1 h-px mx-1 ${pasoActual > step.num ? 'bg-success' : 'bg-outline-variant'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* === PASO 1: INFORMACIÓN GENERAL === */}
              {pasoActual === 1 && (
                <div className="space-y-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalNombre">Nombre <span className="text-danger">*</span></label>
                    <input id="modalNombre" type="text" value={nombre} onChange={(e) => { setNombre(e.target.value); limpiarError('nombre'); }}
                      placeholder="Ej. Parque Nacional Podocarpus" autoFocus
                      className={`w-full h-11 px-md border ${errores.nombre ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                    {errores.nombre && <p className="text-danger text-sm mt-1">{errores.nombre}</p>}
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalDescripcion">Descripción</label>
                    <textarea id="modalDescripcion" rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Descripción del atractivo..."
                      className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalAccesibilidad">Accesibilidad <span className="text-danger">*</span></label>
                      <select id="modalAccesibilidad" required value={nivelAccesibilidad} onChange={(e) => setNivelAccesibilidad(e.target.value)}
                        className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                        <option value="LIBRE">Libre</option>
                        <option value="RESTRINGIDO">Restringido</option>
                        <option value="PAGADO">Pagado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalConservacion">Estado Conservación <span className="text-danger">*</span></label>
                      <select id="modalConservacion" required value={estadoConservacion} onChange={(e) => setEstadoConservacion(e.target.value)}
                        className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                        <option value="CONSERVADO">Conservado</option>
                        <option value="ALTERADO">Alterado</option>
                        <option value="EN_DETERIORO">En deterioro</option>
                        <option value="DETERIORADO">Deteriorado</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalSector">Sector <span className="text-danger">*</span></label>
                    <select id="modalSector" required value={sectorId} onChange={(e) => { setSectorId(e.target.value); limpiarError('sector'); }}
                      className={`w-full h-11 px-md border ${errores.sector ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`}>
                      <option value="">-- Seleccione un sector --</option>
                      {sectoresDisponibles.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre} ({s.parroquia?.nombre || ''})</option>
                      ))}
                    </select>
                    {errores.sector && <p className="text-danger text-sm mt-1">{errores.sector}</p>}
                  </div>
                </div>
              )}

              {/* === PASO 2: UBICACIÓN Y CLIMA === */}
              {pasoActual === 2 && (
                <div className="space-y-md">
                  <div>
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>Coordenadas
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalLat">Latitud <span className="text-danger">*</span></label>
                        <input id="modalLat" type="number" step="any" value={latitud} onChange={(e) => { setLatitud(e.target.value); limpiarError('latitud'); }}
                          className={`w-full h-11 px-md border ${errores.latitud ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.latitud && <p className="text-danger text-sm mt-1">{errores.latitud}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalLng">Longitud <span className="text-danger">*</span></label>
                        <input id="modalLng" type="number" step="any" value={longitud} onChange={(e) => { setLongitud(e.target.value); limpiarError('longitud'); }}
                          className={`w-full h-11 px-md border ${errores.longitud ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.longitud && <p className="text-danger text-sm mt-1">{errores.longitud}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalAlt">Altitud (msnm) <span className="text-danger">*</span></label>
                        <input id="modalAlt" type="number" step="any" min="0" value={altitud} onChange={(e) => { setAltitud(e.target.value); limpiarError('altitud'); }}
                          className={`w-full h-11 px-md border ${errores.altitud ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.altitud && <p className="text-danger text-sm mt-1">{errores.altitud}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">signpost</span>Dirección
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalCalleP">Calle Principal <span className="text-danger">*</span></label>
                        <input id="modalCalleP" type="text" value={callePrincipal} onChange={(e) => { setCallePrincipal(e.target.value); limpiarError('callePrincipal'); }}
                          className={`w-full h-11 px-md border ${errores.callePrincipal ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.callePrincipal && <p className="text-danger text-sm mt-1">{errores.callePrincipal}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalCalleT">Calle Transversal <span className="text-danger">*</span></label>
                        <input id="modalCalleT" type="text" value={calleTransversal} onChange={(e) => { setCalleTransversal(e.target.value); limpiarError('calleTransversal'); }}
                          className={`w-full h-11 px-md border ${errores.calleTransversal ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.calleTransversal && <p className="text-danger text-sm mt-1">{errores.calleTransversal}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalNumero">Número <span className="text-danger">*</span></label>
                        <input id="modalNumero" type="text" value={numero} onChange={(e) => { setNumero(e.target.value); limpiarError('numero'); }}
                          className={`w-full h-11 px-md border ${errores.numero ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.numero && <p className="text-danger text-sm mt-1">{errores.numero}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalRef">Referencia <span className="text-danger">*</span></label>
                        <input id="modalRef" type="text" value={referencia} onChange={(e) => { setReferencia(e.target.value); limpiarError('referencia'); }}
                          className={`w-full h-11 px-md border ${errores.referencia ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.referencia && <p className="text-danger text-sm mt-1">{errores.referencia}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">ac_unit</span>Clima
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalClima">Tipo de Clima <span className="text-danger">*</span></label>
                        <input id="modalClima" type="text" value={clima} onChange={(e) => { setClima(e.target.value); limpiarError('clima'); }} placeholder="Ej. Templado húmedo"
                          className={`w-full h-11 px-md border ${errores.clima ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.clima && <p className="text-danger text-sm mt-1">{errores.clima}</p>}
                      </div>
                      <div></div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Temp. Mínima (°C) <span className="text-danger">*</span></label>
                        <input type="number" min="0" value={tempMin} onChange={(e) => { setTempMin(e.target.value); limpiarError('tempMin'); }}
                          className={`w-full h-11 px-md border ${errores.tempMin ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.tempMin && <p className="text-danger text-sm mt-1">{errores.tempMin}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Temp. Máxima (°C) <span className="text-danger">*</span></label>
                        <input type="number" min="0" value={tempMax} onChange={(e) => { setTempMax(e.target.value); limpiarError('tempMax'); }}
                          className={`w-full h-11 px-md border ${errores.tempMax ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.tempMax && <p className="text-danger text-sm mt-1">{errores.tempMax}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Precip. Mínima (mm) <span className="text-danger">*</span></label>
                        <input type="number" min="0" value={precipMin} onChange={(e) => { setPrecipMin(e.target.value); limpiarError('precipMin'); }}
                          className={`w-full h-11 px-md border ${errores.precipMin ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.precipMin && <p className="text-danger text-sm mt-1">{errores.precipMin}</p>}
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Precip. Máxima (mm) <span className="text-danger">*</span></label>
                        <input type="number" min="0" value={precipMax} onChange={(e) => { setPrecipMax(e.target.value); limpiarError('precipMax'); }}
                          className={`w-full h-11 px-md border ${errores.precipMax ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                        {errores.precipMax && <p className="text-danger text-sm mt-1">{errores.precipMax}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === PASO 3: SERVICIOS Y HORARIOS === */}
              {pasoActual === 3 && (
                <div className="space-y-md">
                  <div>
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">room_service</span>Servicios
                    </h5>

                    {serviciosExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {serviciosExistentes.map(s => (
                          <div key={s.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <div className="flex-1">
                              <span className="font-label-md text-label-md text-on-surface font-medium">{s.nombre}</span>
                              {s.descripcion && <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{s.descripcion}</span>}
                              {s.costo > 0 && <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">${s.costo}</span>}
                            </div>
                            <button type="button" onClick={() => eliminarServicioExistente(s)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errorServicio && <p className="text-danger text-sm mb-sm">{errorServicio}</p>}
                    <div className="space-y-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                        <input type="text" placeholder="Nombre del servicio" value={nuevoServicio.nombre}
                          onChange={(e) => { setNuevoServicio(prev => ({ ...prev, nombre: e.target.value })); setErrorServicio(''); }}
                          className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                        <input type="text" placeholder="Descripción" value={nuevoServicio.descripcion}
                          onChange={(e) => setNuevoServicio(prev => ({ ...prev, descripcion: e.target.value }))}
                          className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                      </div>
                      <div className="flex flex-wrap items-center gap-md">
                        <input type="number" step="0.01" min="0" placeholder="Costo" value={nuevoServicio.costo}
                          onChange={(e) => setNuevoServicio(prev => ({ ...prev, costo: e.target.value }))}
                          className="w-28 h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                        <label className="flex items-center gap-xs text-sm text-on-surface-variant cursor-pointer whitespace-nowrap">
                          <input type="checkbox" checked={nuevoServicio.esta_disponible}
                            onChange={(e) => setNuevoServicio(prev => ({ ...prev, esta_disponible: e.target.checked }))}
                            className="accent-primary" />
                          Disponible
                        </label>
                        <button type="button" onClick={agregarServicio}
                          className="h-11 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center justify-center gap-sm">
                          <span className="material-symbols-outlined text-[20px]">add</span>Agregar
                        </button>
                      </div>
                    </div>
                    {serviciosNuevos.length > 0 && (
                      <div className="space-y-sm mt-md">
                        {serviciosNuevos.map((s, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface font-medium">{s.nombre}</span>
                            <button type="button" onClick={() => setServiciosNuevos(prev => prev.filter((_, j) => j !== i))}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>Horarios
                    </h5>

                    {horariosExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {horariosExistentes.map(h => (
                          <div key={h.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface">
                              {tipoHorarioOptions.find(o => o.value === h.tipo_horario)?.label || h.tipo_horario}: {h.hora_inicio} — {h.hora_fin}
                            </span>
                            <button type="button" onClick={() => eliminarHorarioExistente(h)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errorHorario && <p className="text-danger text-sm mb-sm">{errorHorario}</p>}
                    {errores.horarios && <p className="text-danger text-sm mb-sm">{errores.horarios}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-md">
                      <select value={nuevoHorario.tipo_horario}
                        onChange={(e) => setNuevoHorario(prev => ({ ...prev, tipo_horario: e.target.value }))}
                        className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                        {tipoHorarioOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input type="time" value={nuevoHorario.hora_inicio}
                        onChange={(e) => setNuevoHorario(prev => ({ ...prev, hora_inicio: e.target.value }))}
                        className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                      <input type="time" value={nuevoHorario.hora_fin}
                        onChange={(e) => setNuevoHorario(prev => ({ ...prev, hora_fin: e.target.value }))}
                        className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                      <button type="button" onClick={agregarHorario}
                        className="h-11 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center justify-center gap-sm">
                        <span className="material-symbols-outlined text-[20px]">add</span>Agregar
                      </button>
                    </div>
                    {horariosNuevos.length > 0 && (
                      <div className="space-y-sm mt-md">
                        {horariosNuevos.map((h, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface">
                              {tipoHorarioOptions.find(o => o.value === h.tipo_horario)?.label || h.tipo_horario}: {h.hora_inicio} — {h.hora_fin}
                            </span>
                            <button type="button" onClick={() => setHorariosNuevos(prev => prev.filter((_, j) => j !== i))}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* === PASO 4: CLASIFICACIÓN === */}
              {pasoActual === 4 && (
                <div className="space-y-md">
                  <div>
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">category</span>Clasificaciones
                    </h5>
                    {clasificacionesDisponibles.length === 0 ? (
                      <p className="font-body-md text-body-md text-on-surface-variant">No hay clasificaciones disponibles. Créalas desde Gestión de Clasificaciones.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-sm">
                        {clasificacionesDisponibles.map(c => {
                          const nivelLabel = { CATEGORIA: 'Categoría', TIPO: 'Tipo', SUBTIPO: 'Subtipo' };
                          return (
                            <label key={c.id} className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-colors ${clasificacionesSeleccionadas.includes(c.id) ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-outline'}`}>
                              <input type="checkbox" checked={clasificacionesSeleccionadas.includes(c.id)}
                                onChange={() => toggleClasificacion(c.id)} className="accent-primary w-4 h-4" />
                              <div className="flex-1 min-w-0">
                                <p className="font-label-md text-label-md text-on-surface truncate">{c.nombre}</p>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">{nivelLabel[c.nivel] || c.nivel}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">alt_route</span>Rutas Asociadas
                    </h5>
                    {rutasDisponibles.length === 0 ? (
                      <p className="font-body-md text-body-md text-on-surface-variant">No hay rutas disponibles.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                        {rutasDisponibles.map(r => (
                          <label key={r.id} className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-colors ${rutasSeleccionadas.includes(r.id) ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-outline'}`}>
                            <input type="checkbox" checked={rutasSeleccionadas.includes(r.id)}
                              onChange={() => toggleRuta(r.id)} className="accent-primary w-4 h-4" />
                            <div className="flex-1 min-w-0">
                              <p className="font-label-md text-label-md text-on-surface truncate">{r.nombre}</p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">Dificultad: {'★'.repeat(r.nivel_dificultad || 1)}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">folder</span>Recursos
                    </h5>

                    {recursosExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {recursosExistentes.map(r => (
                          <div key={r.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <div className="flex items-center gap-md flex-1 min-w-0">
                              {r.tipo_recurso === 'IMAGEN' && r.archivo && (
                                <img src={r.archivo} alt={r.titulo} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <span className="font-label-md text-label-md text-on-surface font-medium">{r.titulo}</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{r.tipo_recurso_display || r.tipo_recurso}</span>
                                {r.descripcion && <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{r.descripcion}</span>}
                              </div>
                            </div>
                            <button type="button" onClick={() => eliminarRecursoExistente(r)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all flex-shrink-0">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errorRecurso && <p className="text-danger text-sm mb-sm">{errorRecurso}</p>}
                    <div className="space-y-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                        <input type="text" placeholder="Título del recurso" value={nuevoRecurso.titulo}
                          onChange={(e) => { setNuevoRecurso(prev => ({ ...prev, titulo: e.target.value })); setErrorRecurso(''); }}
                          className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                        <input type="text" placeholder="Descripción" value={nuevoRecurso.descripcion}
                          onChange={(e) => setNuevoRecurso(prev => ({ ...prev, descripcion: e.target.value }))}
                          className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                        <select value={nuevoRecurso.tipo_recurso}
                          onChange={(e) => setNuevoRecurso(prev => ({ ...prev, tipo_recurso: e.target.value }))}
                          className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                          <option value="IMAGEN">Imagen</option>
                          <option value="VIDEO">Video</option>
                          <option value="DOCUMENTO">Documento</option>
                          <option value="INFOGRAFIA">Infografía</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap items-center gap-md">
                        <label className="flex items-center gap-xs text-sm text-on-surface-variant cursor-pointer whitespace-nowrap px-md h-11 border border-outline rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-all">
                          <span className="material-symbols-outlined text-[18px]">upload_file</span>
                          <span className="font-body-md">{nuevoRecurso.archivo ? nuevoRecurso.archivo.name : 'Seleccionar archivo'}</span>
                          <input type="file" className="hidden"
                            onChange={(e) => { setNuevoRecurso(prev => ({ ...prev, archivo: e.target.files[0] })); setErrorRecurso(''); }} />
                        </label>
                        <button type="button" onClick={agregarRecurso}
                          className="h-11 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center justify-center gap-sm">
                          <span className="material-symbols-outlined text-[20px]">add</span>Agregar
                        </button>
                      </div>
                    </div>
                    {recursosNuevos.length > 0 && (
                      <div className="space-y-sm mt-md">
                        {recursosNuevos.map((r, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <div className="flex items-center gap-md flex-1 min-w-0">
                              {r.tipo_recurso === 'IMAGEN' && r.archivo && (
                                <img src={URL.createObjectURL(r.archivo)} alt={r.titulo} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <span className="font-label-md text-label-md text-on-surface font-medium">{r.titulo}</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{r.tipo_recurso}</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{r.archivo?.name || ''}</span>
                              </div>
                            </div>
                            <button type="button" onClick={() => setRecursosNuevos(prev => prev.filter((_, j) => j !== i))}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* === FOOTER === */}
              <div className="flex justify-between gap-md pt-md border-t border-outline-variant mt-lg">
                <button type="button" onClick={pasoActual === 1 ? cerrarModal : anteriorPaso}
                  className="px-xl h-10 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                  {pasoActual === 1 ? 'Cancelar' : 'Anterior'}
                </button>
                {pasoActual < 4 ? (
                  <button type="button" onClick={siguientePaso}
                    className="px-xl h-10 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all flex items-center gap-sm">
                    Siguiente <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                ) : (
                  <button type="submit" disabled={submitting}
                    className="px-xl h-10 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-60">
                    {submitting ? 'Guardando...' : (editando ? 'Actualizar Atractivo' : 'Guardar Atractivo')}
                  </button>
                )}
              </div>
              </form>
          </div>
        </div>
      )}
    </>
  );
}
