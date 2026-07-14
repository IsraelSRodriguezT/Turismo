import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

const tipoEvidenciaOptions = [
  { value: 'PRODUCTO', label: 'Producto' },
  { value: 'RESULTADO', label: 'Resultado' },
  { value: 'APRENDIZAJE', label: 'Aprendizaje' },
];

export default function AdminInvestigacion() {
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [sectorId, setSectorId] = useState('');

  const [errores, setErrores] = useState({});

  const [newActor, setNewActor] = useState({ nombre: '', apellido: '', correo: '', telefono: '', organizacion: '' });
  const [actoresNuevos, setActoresNuevos] = useState([]);
  const [actoresExistentes, setActoresExistentes] = useState([]);
  const [actoresAEliminar, setActoresAEliminar] = useState([]);
  const [errorActor, setErrorActor] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const [newEvidencia, setNewEvidencia] = useState({ titulo: '', descripcion: '', tipo_evidencia: 'RESULTADO', recomendacion: '' });
  const [evidenciasNuevas, setEvidenciasNuevas] = useState([]);
  const [evidenciasExistentes, setEvidenciasExistentes] = useState([]);
  const [evidenciasAEliminar, setEvidenciasAEliminar] = useState([]);
  const [errorEvidencia, setErrorEvidencia] = useState('');

  const [newPlan, setNewPlan] = useState({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
  const [planesNuevos, setPlanesNuevos] = useState([]);
  const [planesExistentes, setPlanesExistentes] = useState([]);
  const [planesAEliminar, setPlanesAEliminar] = useState([]);
  const [errorPlan, setErrorPlan] = useState('');

  const [newImpacto, setNewImpacto] = useState({ descripcion: '', nivel_impacto: 5, fecha_evaluacion: '' });
  const [impactosNuevos, setImpactosNuevos] = useState([]);
  const [impactosExistentes, setImpactosExistentes] = useState([]);
  const [impactosAEliminar, setImpactosAEliminar] = useState([]);
  const [errorImpacto, setErrorImpacto] = useState('');

  const [pasoActual, setPasoActual] = useState(1);
  const [sectoresMap, setSectoresMap] = useState({});

  const cargarProyectos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [respProyectos, respSectores] = await Promise.all([
        api.get('/investigacion/proyectos/'),
        api.get('/geolocalizacion/sectores/'),
      ]);
      setProyectos(respProyectos.data.data || []);
      const sectoresList = respSectores.data.data || [];
      setSectores(sectoresList);
      const map = {};
      sectoresList.forEach(s => { map[s.id] = s; });
      setSectoresMap(map);
    } catch {
      setError('No se pudieron cargar los proyectos de investigación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarProyectos(); }, []);

  const openModal = async (proyecto = null) => {
    setModalError(null);
    if (sectores.length === 0) {
      try {
        const res = await api.get('/geolocalizacion/sectores/');
        const sectoresList = res.data.data || [];
        setSectores(sectoresList);
        const map = {};
        sectoresList.forEach(s => { map[s.id] = s; });
        setSectoresMap(map);
      } catch {}
    }

    if (proyecto) {
      setEditando(proyecto.id);
      setTitulo(proyecto.titulo || '');
      setDescripcion(proyecto.descripcion || '');
      setObjetivo(proyecto.objetivo || '');
      setFechaInicio(proyecto.fecha_inicio || '');
      setFechaFin(proyecto.fecha_fin || '');
      setSectorId(proyecto.sector || '');
      setActoresExistentes(proyecto.actores || []);
      setEvidenciasExistentes(proyecto.evidencias || []);
      setPlanesExistentes(proyecto.planes_accion || []);
      setImpactosExistentes(proyecto.impactos || []);
      setActoresNuevos([]);
      setActoresAEliminar([]);
      setEvidenciasNuevas([]);
      setEvidenciasAEliminar([]);
      setPlanesNuevos([]);
      setPlanesAEliminar([]);
      setImpactosNuevos([]);
      setImpactosAEliminar([]);
    } else {
      resetForm();
    }
    setPasoActual(1);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditando(null);
    setTitulo(''); setDescripcion(''); setObjetivo('');
    setFechaInicio(''); setFechaFin(''); setSectorId('');
    setActoresExistentes([]); setActoresNuevos([]); setActoresAEliminar([]);
    setEvidenciasExistentes([]); setEvidenciasNuevas([]); setEvidenciasAEliminar([]);
    setPlanesExistentes([]); setPlanesNuevos([]); setPlanesAEliminar([]);
    setImpactosExistentes([]); setImpactosNuevos([]); setImpactosAEliminar([]);
    setErrores({});
    setErrorActor(''); setErrorEvidencia(''); setErrorPlan(''); setErrorImpacto('');
    setPasoActual(1);
    setModalError(null);
  };

  const cerrarModal = () => {
    setShowModal(false);
    resetForm();
  };

  const agregarActor = () => {
    if (!newActor.nombre.trim()) { setErrorActor('El nombre del actor es obligatorio.'); return; }
    if (newActor.nombre.length > 120) { setErrorActor('El nombre no puede exceder 120 caracteres.'); return; }
    if (!newActor.apellido.trim()) { setErrorActor('El apellido del actor es obligatorio.'); return; }
    if (newActor.apellido.length > 120) { setErrorActor('El apellido no puede exceder 120 caracteres.'); return; }
    if (!newActor.organizacion.trim()) { setErrorActor('La organización es obligatoria.'); return; }
    if (newActor.organizacion.length > 255) { setErrorActor('La organización no puede exceder 255 caracteres.'); return; }
    if (newActor.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newActor.correo)) { setErrorActor('El correo no tiene un formato válido.'); return; }
    setErrorActor('');
    setErrorEmail('');
    setActoresNuevos(prev => [...prev, { ...newActor }]);
    setNewActor({ nombre: '', apellido: '', correo: '', telefono: '', organizacion: '' });
  };

  const eliminarActorExistente = (a) => {
    setActoresExistentes(prev => prev.filter(x => x.id !== a.id));
    setActoresAEliminar(prev => [...prev, a.id]);
  };

  const agregarEvidencia = () => {
    if (!newEvidencia.titulo.trim()) { setErrorEvidencia('El título de la evidencia es obligatorio.'); return; }
    if (newEvidencia.titulo.length > 255) { setErrorEvidencia('El título no puede exceder 255 caracteres.'); return; }
    if (!newEvidencia.descripcion.trim()) { setErrorEvidencia('La descripción de la evidencia es obligatoria.'); return; }
    setErrorEvidencia('');
    setEvidenciasNuevas(prev => [...prev, { ...newEvidencia }]);
    setNewEvidencia({ titulo: '', descripcion: '', tipo_evidencia: 'RESULTADO', recomendacion: '' });
  };

  const eliminarEvidenciaExistente = (e) => {
    setEvidenciasExistentes(prev => prev.filter(x => x.id !== e.id));
    setEvidenciasAEliminar(prev => [...prev, e.id]);
  };

  const agregarPlan = () => {
    if (!newPlan.nombre.trim()) { setErrorPlan('El nombre del plan es obligatorio.'); return; }
    if (newPlan.nombre.length > 255) { setErrorPlan('El nombre no puede exceder 255 caracteres.'); return; }
    if (!newPlan.descripcion.trim()) { setErrorPlan('La descripción del plan es obligatoria.'); return; }
    if (!newPlan.fecha_inicio || !newPlan.fecha_fin) { setErrorPlan('Las fechas de inicio y fin son obligatorias.'); return; }
    if (new Date(newPlan.fecha_fin) < new Date(newPlan.fecha_inicio)) { setErrorPlan('La fecha de fin no puede ser anterior a la fecha de inicio.'); return; }
    setErrorPlan('');
    setPlanesNuevos(prev => [...prev, { ...newPlan }]);
    setNewPlan({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
  };

  const eliminarPlanExistente = (p) => {
    setPlanesExistentes(prev => prev.filter(x => x.id !== p.id));
    setPlanesAEliminar(prev => [...prev, p.id]);
  };

  const agregarImpacto = () => {
    if (!newImpacto.descripcion.trim()) { setErrorImpacto('La descripción del impacto es obligatoria.'); return; }
    if (!newImpacto.nivel_impacto || isNaN(parseInt(newImpacto.nivel_impacto)) || parseInt(newImpacto.nivel_impacto) < 1 || parseInt(newImpacto.nivel_impacto) > 10)
      { setErrorImpacto('El nivel de impacto debe estar entre 1 y 10.'); return; }
    if (!newImpacto.fecha_evaluacion) { setErrorImpacto('La fecha de evaluación es obligatoria.'); return; }
    setErrorImpacto('');
    setImpactosNuevos(prev => [...prev, { ...newImpacto, nivel_impacto: parseInt(newImpacto.nivel_impacto) }]);
    setNewImpacto({ descripcion: '', nivel_impacto: 5, fecha_evaluacion: '' });
  };

  const eliminarImpactoExistente = (i) => {
    setImpactosExistentes(prev => prev.filter(x => x.id !== i.id));
    setImpactosAEliminar(prev => [...prev, i.id]);
  };

  const validarPaso = (paso) => {
    const e = {};
    if (paso === 1) {
      if (!titulo.trim()) e.titulo = 'El título es obligatorio.';
      else if (titulo.length > 255) e.titulo = 'El título no puede exceder 255 caracteres.';
      if (!descripcion.trim()) e.descripcion = 'La descripción es obligatoria.';
      if (!objetivo.trim()) e.objetivo = 'El objetivo es obligatorio.';
    }
    if (paso === 2) {
      if (!fechaInicio) e.fechaInicio = 'La fecha de inicio es obligatoria.';
      if (!fechaFin) e.fechaFin = 'La fecha de fin es obligatoria.';
      if (fechaInicio && fechaFin) {
        if (new Date(fechaFin) < new Date(fechaInicio))
          e.fechaFin = 'No puede ser anterior a la fecha de inicio.';
        else if (fechaFin === fechaInicio)
          e.fechaFin = 'Debe ser distinta a la fecha de inicio.';
      }
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const validarFormulario = () => {
    const e = {};
    if (!titulo.trim()) e.titulo = 'El título es obligatorio.';
    else if (titulo.length > 255) e.titulo = 'El título no puede exceder 255 caracteres.';
    if (!descripcion.trim()) e.descripcion = 'La descripción es obligatoria.';
    if (!objetivo.trim()) e.objetivo = 'El objetivo es obligatorio.';
    if (!fechaInicio) e.fechaInicio = 'La fecha de inicio es obligatoria.';
    if (!fechaFin) e.fechaFin = 'La fecha de fin es obligatoria.';
    if (fechaInicio && fechaFin) {
      if (new Date(fechaFin) < new Date(fechaInicio))
        e.fechaFin = 'No puede ser anterior a la fecha de inicio.';
      else if (fechaFin === fechaInicio)
        e.fechaFin = 'Debe ser distinta a la fecha de inicio.';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const siguientePaso = () => {
    if (pasoActual < 3 && validarPaso(pasoActual)) setPasoActual(p => p + 1);
  };

  const anteriorPaso = () => {
    if (pasoActual > 1) { setPasoActual(p => p - 1); setErrores({}); }
  };

  const limpiarError = (campo) => {
    setErrores(prev => ({ ...prev, [campo]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setSubmitting(true);
    setModalError(null);
    try {
      const payload = {
        titulo, descripcion, objetivo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        sector: sectorId ? Number(sectorId) : null,
      };

      let proyectoId;

      if (editando) {
        await api.put(`/investigacion/proyectos/${editando}/`, payload);
        proyectoId = editando;
      } else {
        const res = await api.post('/investigacion/proyectos/', payload);
        proyectoId = res.data?.data?.id;
      }

      if (proyectoId) {
        for (const id of actoresAEliminar) { await api.delete(`/investigacion/actores/${id}/`).catch(() => {}); }
        for (const id of evidenciasAEliminar) { await api.delete(`/investigacion/evidencias/${id}/`).catch(() => {}); }
        for (const id of planesAEliminar) { await api.delete(`/investigacion/planes-accion/${id}/`).catch(() => {}); }
        for (const id of impactosAEliminar) { await api.delete(`/investigacion/impactos/${id}/`).catch(() => {}); }

        for (const a of actoresNuevos) { await api.post(`/investigacion/proyectos/${proyectoId}/actores/`, a).catch(() => {}); }
        for (const ev of evidenciasNuevas) { await api.post(`/investigacion/proyectos/${proyectoId}/evidencias/`, ev).catch(() => {}); }
        for (const pl of planesNuevos) { await api.post(`/investigacion/proyectos/${proyectoId}/planes-accion/`, pl).catch(() => {}); }
        for (const im of impactosNuevos) { await api.post(`/investigacion/proyectos/${proyectoId}/impactos/`, im).catch(() => {}); }
      }

      cerrarModal();
      cargarProyectos();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error al guardar el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, tituloP) => {
    if (!confirm(`¿Eliminar el proyecto "${tituloP}"?`)) return;
    try {
      await api.delete(`/investigacion/proyectos/${id}/`);
      cargarProyectos();
    } catch {
      alert('No se pudo eliminar el proyecto.');
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/investigacion" className="hover:text-primary">Investigación</Link>
      </nav>

      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Proyectos de Investigación</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: {proyectos.length} registros</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
          <span className="material-symbols-outlined">add</span>Agregar Proyecto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md animate-spin">autorenew</span>
          <p className="font-body-lg text-body-lg">Cargando proyectos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-xl text-danger">
          <span className="material-symbols-outlined text-[48px] block mb-md">error</span>
          <p className="font-body-lg text-body-lg">{error}</p>
        </div>
      ) : proyectos.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md">biotech</span>
          <p className="font-body-lg text-body-lg">No hay proyectos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {proyectos.map((p) => (
            <div key={p.id} className="bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-md hover:border-primary transition-all group">
              <div className="p-lg">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate mb-sm">{p.titulo}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md">{p.descripcion || 'Sin descripción'}</p>
                <div className="flex flex-wrap items-center gap-x-lg gap-y-1 mb-md text-sm text-on-surface-variant">
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    {p.fecha_inicio} — {p.fecha_fin}
                  </span>
                  {p.sector && sectoresMap[p.sector] && (
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {sectoresMap[p.sector].nombre}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-md">
                  {p.actores?.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary-container/40 text-primary rounded-full text-xs font-medium">
                      {p.actores.length} actor{p.actores.length !== 1 ? 'es' : ''}
                    </span>
                  )}
                  {p.evidencias?.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary-container/40 text-primary rounded-full text-xs font-medium">
                      {p.evidencias.length} evidencia{p.evidencias.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {p.planes_accion?.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary-container/40 text-primary rounded-full text-xs font-medium">
                      {p.planes_accion.length} plan{p.planes_accion.length !== 1 ? 'es' : ''}
                    </span>
                  )}
                  {p.impactos?.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary-container/40 text-primary rounded-full text-xs font-medium">
                      {p.impactos.length} impacto{p.impactos.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 pt-md border-t border-outline-variant">
                  <button onClick={() => openModal(p)}
                    className="inline-flex items-center justify-center w-9 h-9 text-primary rounded-lg hover:bg-primary-fixed transition-all"
                    title="Editar">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleEliminar(p.id, p.titulo)}
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

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 overflow-y-auto py-4">
          <div className="w-full max-w-4xl mx-4 bg-surface rounded-xl border border-outline-variant shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editando ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h3>
              <button onClick={cerrarModal}
                className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); if (pasoActual < 3) siguientePaso(); }
            }} className="p-lg">
              {modalError && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-error-container text-on-error-container border-error/20 mb-md">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="font-body-md flex-1">{modalError}</p>
                </div>
              )}

              <div className="flex items-center gap-0 mb-lg px-1">
                {[
                  { num: 1, icon: 'info', label: 'General' },
                  { num: 2, icon: 'calendar_month', label: 'Fechas' },
                  { num: 3, icon: 'groups', label: 'Miembros' },
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
                    {i < 2 && (
                      <div className={`flex-1 h-px mx-1 ${pasoActual > step.num ? 'bg-success' : 'bg-outline-variant'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {pasoActual === 1 && (
                <div className="space-y-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalTitulo">Título <span className="text-danger">*</span></label>
                    <input id="modalTitulo" type="text" value={titulo} onChange={(e) => { setTitulo(e.target.value); limpiarError('titulo'); }}
                      placeholder="Ej. Análisis de Flora Urbana" autoFocus maxLength={255}
                      className={`w-full h-11 px-md border ${errores.titulo ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                    {errores.titulo && <p className="text-danger text-sm mt-1">{errores.titulo}</p>}
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalDescripcion">Descripción <span className="text-danger">*</span></label>
                    <textarea id="modalDescripcion" rows="3" value={descripcion} onChange={(e) => { setDescripcion(e.target.value); limpiarError('descripcion'); }}
                      placeholder="Detalle del proyecto..." maxLength={2000}
                      className={`w-full px-md py-3 border ${errores.descripcion ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none`} />
                    {errores.descripcion && <p className="text-danger text-sm mt-1">{errores.descripcion}</p>}
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalObjetivo">Objetivo <span className="text-danger">*</span></label>
                    <textarea id="modalObjetivo" rows="2" value={objetivo} onChange={(e) => { setObjetivo(e.target.value); limpiarError('objetivo'); }}
                      placeholder="Objetivo principal del proyecto..." maxLength={2000}
                      className={`w-full px-md py-3 border ${errores.objetivo ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none`} />
                    {errores.objetivo && <p className="text-danger text-sm mt-1">{errores.objetivo}</p>}
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalSector">Sector Geográfico</label>
                    <select id="modalSector" value={sectorId} onChange={(e) => setSectorId(e.target.value)}
                      className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                      <option value="">-- Seleccione un sector --</option>
                      {sectores.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre} ({s.parroquia?.nombre || ''})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {pasoActual === 2 && (
                <div className="space-y-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalFechaInicio">Fecha de Inicio <span className="text-danger">*</span></label>
                      <input id="modalFechaInicio" type="date" value={fechaInicio} onChange={(e) => { setFechaInicio(e.target.value); limpiarError('fechaInicio'); }}
                        className={`w-full h-11 px-md border ${errores.fechaInicio ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                      {errores.fechaInicio && <p className="text-danger text-sm mt-1">{errores.fechaInicio}</p>}
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalFechaFin">Fecha de Fin <span className="text-danger">*</span></label>
                      <input id="modalFechaFin" type="date" value={fechaFin}
                        min={fechaInicio ? new Date(new Date(fechaInicio).getTime() + 86400000).toISOString().split('T')[0] : ''}
                        onChange={(e) => { setFechaFin(e.target.value); limpiarError('fechaFin'); }}
                        className={`w-full h-11 px-md border ${errores.fechaFin ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                      {errores.fechaFin && <p className="text-danger text-sm mt-1">{errores.fechaFin}</p>}
                    </div>
                  </div>
                </div>
              )}

              {pasoActual === 3 && (
                <div className="space-y-md max-h-[500px] overflow-y-auto pr-1">
                  <div>
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm sticky top-0 bg-surface z-10 py-1">
                      <span className="material-symbols-outlined text-[18px]">person</span>Actores
                    </h5>
                    {actoresExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {actoresExistentes.map(a => (
                          <div key={a.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <div className="flex-1 min-w-0">
                              <span className="font-label-md text-label-md text-on-surface font-medium">{a.nombre} {a.apellido}</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{a.organizacion}</span>
                              {a.correo && <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{a.correo}</span>}
                            </div>
                            <button type="button" onClick={() => eliminarActorExistente(a)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all flex-shrink-0">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errorActor && <p className="text-danger text-sm mb-sm">{errorActor}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                      <input type="text" placeholder="Nombre" value={newActor.nombre} maxLength={120}
                        onChange={(e) => { setNewActor(prev => ({ ...prev, nombre: e.target.value })); setErrorActor(''); }}
                        className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      <input type="text" placeholder="Apellido" value={newActor.apellido} maxLength={120}
                        onChange={(e) => setNewActor(prev => ({ ...prev, apellido: e.target.value }))}
                        className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      <input type="text" placeholder="Organización" value={newActor.organizacion} maxLength={255}
                        onChange={(e) => setNewActor(prev => ({ ...prev, organizacion: e.target.value }))}
                        className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-sm mt-sm">
                      <div className="flex-1 min-w-[140px]">
                        <input type="email" placeholder="Correo" value={newActor.correo} maxLength={254}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewActor(prev => ({ ...prev, correo: val }));
                            setErrorEmail(val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Formato de correo inválido' : '');
                          }}
                          className={`w-full h-10 px-md border ${errorEmail ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm`} />
                        {errorEmail && <p className="text-danger text-sm mt-0.5">{errorEmail}</p>}
                      </div>
                      <input type="text" placeholder="Teléfono" value={newActor.telefono} maxLength={10}
                        onChange={(e) => setNewActor(prev => ({ ...prev, telefono: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        className="w-28 h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      <button type="button" onClick={agregarActor}
                        className="h-10 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center gap-xs text-sm">
                        <span className="material-symbols-outlined text-[18px]">add</span>Agregar
                      </button>
                    </div>
                    {actoresNuevos.length > 0 && (
                      <div className="space-y-sm mt-sm">
                        {actoresNuevos.map((a, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface">{a.nombre} {a.apellido} — {a.organizacion}</span>
                            <button type="button" onClick={() => setActoresNuevos(prev => prev.filter((_, j) => j !== i))}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm sticky top-0 bg-surface z-10 py-1">
                      <span className="material-symbols-outlined text-[18px]">description</span>Evidencias
                    </h5>
                    {evidenciasExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {evidenciasExistentes.map(ev => (
                          <div key={ev.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <div className="flex-1 min-w-0">
                              <span className="font-label-md text-label-md text-on-surface font-medium">{ev.titulo}</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{ev.tipo_evidencia}</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{ev.fecha_registro}</span>
                            </div>
                            <button type="button" onClick={() => eliminarEvidenciaExistente(ev)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all flex-shrink-0">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errorEvidencia && <p className="text-danger text-sm mb-sm">{errorEvidencia}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                      <input type="text" placeholder="Título de la evidencia" value={newEvidencia.titulo} maxLength={255}
                        onChange={(e) => { setNewEvidencia(prev => ({ ...prev, titulo: e.target.value })); setErrorEvidencia(''); }}
                        className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      <select value={newEvidencia.tipo_evidencia}
                        onChange={(e) => setNewEvidencia(prev => ({ ...prev, tipo_evidencia: e.target.value }))}
                        className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm">
                        {tipoEvidenciaOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap items-start gap-sm mt-sm">
                      <textarea placeholder="Descripción" rows="2" value={newEvidencia.descripcion} maxLength={2000}
                        onChange={(e) => setNewEvidencia(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="flex-1 min-w-[200px] px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none text-sm" />
                      <textarea placeholder="Recomendación" rows="2" value={newEvidencia.recomendacion} maxLength={2000}
                        onChange={(e) => setNewEvidencia(prev => ({ ...prev, recomendacion: e.target.value }))}
                        className="flex-1 min-w-[200px] px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none text-sm" />
                      <button type="button" onClick={agregarEvidencia}
                        className="h-10 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center gap-xs text-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[18px]">add</span>Agregar
                      </button>
                    </div>
                    {evidenciasNuevas.length > 0 && (
                      <div className="space-y-sm mt-sm">
                        {evidenciasNuevas.map((ev, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface">{ev.titulo} ({ev.tipo_evidencia})</span>
                            <button type="button" onClick={() => setEvidenciasNuevas(prev => prev.filter((_, j) => j !== i))}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm sticky top-0 bg-surface z-10 py-1">
                      <span className="material-symbols-outlined text-[18px]">checklist</span>Planes de Acción
                    </h5>
                    {planesExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {planesExistentes.map(pl => (
                          <div key={pl.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <div className="flex-1 min-w-0">
                              <span className="font-label-md text-label-md text-on-surface font-medium">{pl.nombre}</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{pl.fecha_inicio} — {pl.fecha_fin}</span>
                            </div>
                            <button type="button" onClick={() => eliminarPlanExistente(pl)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all flex-shrink-0">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errorPlan && <p className="text-danger text-sm mb-sm">{errorPlan}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                      <input type="text" placeholder="Nombre del plan" value={newPlan.nombre} maxLength={255}
                        onChange={(e) => { setNewPlan(prev => ({ ...prev, nombre: e.target.value })); setErrorPlan(''); }}
                        className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      <div className="grid grid-cols-2 gap-sm">
                        <input type="date" value={newPlan.fecha_inicio}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                          className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                        <input type="date" value={newPlan.fecha_fin}
                          min={newPlan.fecha_inicio ? new Date(new Date(newPlan.fecha_inicio).getTime() + 86400000).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, fecha_fin: e.target.value }))}
                          className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-start gap-sm mt-sm">
                      <textarea placeholder="Descripción" rows="2" value={newPlan.descripcion} maxLength={2000}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="flex-1 min-w-[200px] px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none text-sm" />
                      <button type="button" onClick={agregarPlan}
                        className="h-10 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center gap-xs text-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[18px]">add</span>Agregar
                      </button>
                    </div>
                    {planesNuevos.length > 0 && (
                      <div className="space-y-sm mt-sm">
                        {planesNuevos.map((pl, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface">{pl.nombre} — {pl.fecha_inicio}</span>
                            <button type="button" onClick={() => setPlanesNuevos(prev => prev.filter((_, j) => j !== i))}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-md">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-sm flex items-center gap-sm sticky top-0 bg-surface z-10 py-1">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>Impactos
                    </h5>
                    {impactosExistentes.length > 0 && (
                      <div className="space-y-sm mb-md">
                        {impactosExistentes.map(im => (
                          <div key={im.id} className="flex items-center justify-between px-md py-2 bg-surface-container-low rounded-lg">
                            <div className="flex-1 min-w-0">
                              <span className="font-label-md text-label-md text-on-surface font-medium">Nivel {im.nivel_impacto}/10</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{im.descripcion}</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant ml-md">{im.fecha_evaluacion}</span>
                            </div>
                            <button type="button" onClick={() => eliminarImpactoExistente(im)}
                              className="text-danger hover:bg-error-container rounded-lg p-1 transition-all flex-shrink-0">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errorImpacto && <p className="text-danger text-sm mb-sm">{errorImpacto}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                      <textarea placeholder="Descripción del impacto" rows="2" value={newImpacto.descripcion} maxLength={2000}
                        onChange={(e) => { setNewImpacto(prev => ({ ...prev, descripcion: e.target.value })); setErrorImpacto(''); }}
                        className="w-full px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all resize-none text-sm" />
                      <div>
                        <label className="block text-xs text-on-surface-variant mb-1">Nivel (1-10)</label>
                        <input type="number" min="1" max="10" value={newImpacto.nivel_impacto}
                          onChange={(e) => setNewImpacto(prev => ({ ...prev, nivel_impacto: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                          className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-on-surface-variant mb-1">Fecha Evaluación</label>
                        <input type="date" value={newImpacto.fecha_evaluacion}
                          onChange={(e) => setNewImpacto(prev => ({ ...prev, fecha_evaluacion: e.target.value }))}
                          className="w-full h-10 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all text-sm" />
                      </div>
                    </div>
                    <button type="button" onClick={agregarImpacto}
                      className="mt-sm h-10 px-md bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all flex items-center gap-xs text-sm">
                      <span className="material-symbols-outlined text-[18px]">add</span>Agregar Impacto
                    </button>
                    {impactosNuevos.length > 0 && (
                      <div className="space-y-sm mt-sm">
                        {impactosNuevos.map((im, i) => (
                          <div key={i} className="flex items-center justify-between px-md py-2 bg-primary-container/20 rounded-lg">
                            <span className="font-label-md text-label-md text-on-surface">Nivel {im.nivel_impacto}/10 — {im.descripcion}</span>
                            <button type="button" onClick={() => setImpactosNuevos(prev => prev.filter((_, j) => j !== i))}
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

              <div className="flex justify-between gap-md pt-md border-t border-outline-variant mt-lg">
                <button type="button" onClick={pasoActual === 1 ? cerrarModal : anteriorPaso}
                  className="px-xl h-10 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                  {pasoActual === 1 ? 'Cancelar' : 'Anterior'}
                </button>
                {pasoActual < 3 ? (
                  <button type="button" onClick={siguientePaso}
                    className="px-xl h-10 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all flex items-center gap-sm">
                    Siguiente <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                ) : (
                  <button type="button" disabled={submitting} onClick={handleSubmit}
                    className="px-xl h-10 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-60">
                    {submitting ? 'Guardando...' : (editando ? 'Actualizar Proyecto' : 'Guardar Proyecto')}
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
