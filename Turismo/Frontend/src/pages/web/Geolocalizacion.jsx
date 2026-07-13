import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapaLeaflet from '../../components/MapaLeaflet';
import api from '../../services/httpClient';

const COLORES_PAISES = [
  'from-blue-600 to-blue-700',
  'from-emerald-600 to-emerald-700',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-violet-500 to-violet-600',
  'from-cyan-500 to-cyan-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
];

const LABEL_NIVEL = { pais: 'País', provincia: 'Provincia', canton: 'Cantón', parroquia: 'Parroquia', sector: 'Sector' };
const PREFIX_NIVEL = { pais: 'Nuevo', provincia: 'Nueva', canton: 'Nuevo', parroquia: 'Nueva', sector: 'Nuevo' };

export default function Geolocalizacion() {
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [loadingPaises, setLoadingPaises] = useState(true);

  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(8);
  const [markers, setMarkers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalLevel, setModalLevel] = useState(null);
  const [editando, setEditando] = useState(null);
  const [formNombre, setFormNombre] = useState('');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalMsg, setModalMsg] = useState(null);
  const [nivelJerarquia, setNivelJerarquia] = useState('cantones');
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [filterCanton, setFilterCanton] = useState('');
  const [filterParroquia, setFilterParroquia] = useState('');
  const [loadingJerarquia, setLoadingJerarquia] = useState(false);
  const [formParentId, setFormParentId] = useState('');
 
  useEffect(() => {
    setLoadingPaises(true);
    api.get('/geolocalizacion/paises/')
      .then(res => setPaises(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoadingPaises(false));
  }, []);

  useEffect(() => {
    if (!paisSeleccionado) {
      setProvincias([]);
      setProvinciaSeleccionada(null);
      setCenter(null);
      setMarkers([]);
      setCantones([]);
      setParroquias([]);
      setSectores([]);
      setFilterCanton('');
      setFilterParroquia('');
      return;
    }
    setLoadingProvincias(true);
    api.get(`/geolocalizacion/provincias/?pais=${paisSeleccionado.id}`)
      .then(res => setProvincias(res.data?.data || []))
      .catch(() => setProvincias([]))
      .finally(() => setLoadingProvincias(false));
    setProvinciaSeleccionada(null);
    setCenter(null);
    setMarkers([]);
    setNivelJerarquia('cantones');
    setFilterCanton('');
    setFilterParroquia('');
    setParroquias([]);
    setSectores([]);
  }, [paisSeleccionado]);

  useEffect(() => {
    if (!provinciaSeleccionada) {
      setCenter(null);
      setMarkers([]);
      return;
    }
    if (provinciaSeleccionada.lat && provinciaSeleccionada.lng) {
      setCenter([Number(provinciaSeleccionada.lat), Number(provinciaSeleccionada.lng)]);
      setZoom(8);
      setMarkers([{
        lat: Number(provinciaSeleccionada.lat),
        lng: Number(provinciaSeleccionada.lng),
        titulo: provinciaSeleccionada.nombre,
      }]);
    } else {
      setCenter(null);
      setMarkers([]);
    }
  }, [provinciaSeleccionada]);

  useEffect(() => {
    if (!provinciaSeleccionada) {
      setCantones([]);
      setParroquias([]);
      setSectores([]);
      setFilterCanton('');
      setFilterParroquia('');
      return;
    }
    setLoadingJerarquia(true);
    api.get(`/geolocalizacion/cantones/?provincia=${provinciaSeleccionada.id}`)
      .then(res => setCantones(res.data?.data || []))
      .catch(() => setCantones([]))
      .finally(() => setLoadingJerarquia(false));
    setNivelJerarquia('cantones');
    setFilterCanton('');
    setFilterParroquia('');
    setParroquias([]);
    setSectores([]);
  }, [provinciaSeleccionada]);

  useEffect(() => {
    if (!filterCanton) {
      setParroquias([]);
      setFilterParroquia('');
      return;
    }
    setLoadingJerarquia(true);
    api.get(`/geolocalizacion/parroquias/?canton=${filterCanton}`)
      .then(res => setParroquias(res.data?.data || []))
      .catch(() => setParroquias([]))
      .finally(() => setLoadingJerarquia(false));
  }, [filterCanton]);

  useEffect(() => {
    if (!filterParroquia) {
      setSectores([]);
      return;
    }
    setLoadingJerarquia(true);
    api.get(`/geolocalizacion/sectores/?parroquia=${filterParroquia}`)
      .then(res => setSectores(res.data?.data || []))
      .catch(() => setSectores([]))
      .finally(() => setLoadingJerarquia(false));
  }, [filterParroquia]);

  const openModal = (level, item = null) => {
    setModalLevel(level);
    setEditando(item?.id || null);
    setFormNombre(item?.nombre || '');
    setFormLat(item?.lat ?? '');
    setFormLng(item?.lng ?? '');
    let parentId = '';
    if (item) {
      if (level === 'parroquia') parentId = item.canton?.id || '';
      else if (level === 'sector') parentId = item.parroquia?.id || '';
    } else {
      if (level === 'parroquia') parentId = filterCanton;
      else if (level === 'sector') parentId = filterParroquia;
    }
    setFormParentId(parentId);
    setModalMsg(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formNombre.trim()) return;
    if ((modalLevel === 'parroquia' || modalLevel === 'sector') && !formParentId) {
      setModalMsg({ type: 'error', text: `Seleccione ${modalLevel === 'parroquia' ? 'un cantón' : 'una parroquia'} válido.` });
      return;
    }
    setSubmitting(true);
    setModalMsg(null);
    try {
      const body = { nombre: formNombre.trim() };
      let endpoint;

      switch (modalLevel) {
        case 'pais':
          endpoint = 'paises';
          break;
        case 'provincia':
          endpoint = 'provincias';
          body.pais_id = paisSeleccionado.id;
          if (formLat !== '') body.lat = formLat;
          if (formLng !== '') body.lng = formLng;
          break;
        case 'canton':
          endpoint = 'cantones';
          body.provincia_id = provinciaSeleccionada.id;
          break;
        case 'parroquia':
          endpoint = 'parroquias';
          body.canton_id = Number(formParentId);
          break;
        case 'sector':
          endpoint = 'sectores';
          body.parroquia_id = Number(formParentId);
          break;
        default:
          return;
      }

      if (editando) {
        await api.put(`/geolocalizacion/${endpoint}/${editando}/`, body);
      } else {
        await api.post(`/geolocalizacion/${endpoint}/`, body);
      }
      setShowModal(false);

      switch (modalLevel) {
        case 'pais': {
          const res = await api.get('/geolocalizacion/paises/');
          const data = res.data?.data || [];
          setPaises(data);
          if (editando && paisSeleccionado?.id === editando) {
            const updated = data.find(p => p.id === editando);
            if (updated) setPaisSeleccionado(updated);
          }
          break;
        }
        case 'provincia': {
          const res = await api.get(`/geolocalizacion/provincias/?pais=${paisSeleccionado.id}`);
          setProvincias(res.data?.data || []);
          break;
        }
        case 'canton': {
          const res = await api.get(`/geolocalizacion/cantones/?provincia=${provinciaSeleccionada.id}`);
          setCantones(res.data?.data || []);
          break;
        }
        case 'parroquia': {
          if (filterCanton) {
            const res = await api.get(`/geolocalizacion/parroquias/?canton=${filterCanton}`);
            setParroquias(res.data?.data || []);
          }
          break;
        }
        case 'sector': {
          if (filterParroquia) {
            const res = await api.get(`/geolocalizacion/sectores/?parroquia=${filterParroquia}`);
            setSectores(res.data?.data || []);
          }
          break;
        }
      }
    } catch (err) {
      setModalMsg({ type: 'error', text: err.response?.data?.message || 'Error al guardar.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminarProvincia = async (id, nombre) => {
    if (!confirm(`¿Eliminar la provincia "${nombre}"?`)) return;
    try {
      await api.delete(`/geolocalizacion/provincias/${id}/`);
      const res = await api.get(`/geolocalizacion/provincias/?pais=${paisSeleccionado.id}`);
      setProvincias(res.data?.data || []);
      if (provinciaSeleccionada?.id === id) setProvinciaSeleccionada(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const handleEliminarPais = async (id, nombre, e) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar el país "${nombre}"?`)) return;
    try {
      await api.delete(`/geolocalizacion/paises/${id}/`);
      const res = await api.get('/geolocalizacion/paises/');
      setPaises(res.data?.data || []);
    } catch (err) {
      console.error('Error al eliminar país:', err);
    }
  };

  const handleEliminarJerarquia = async (tipo, id, nombre) => {
    if (!confirm(`¿Eliminar ${tipo === 'canton' ? 'el cantón' : tipo === 'parroquia' ? 'la parroquia' : 'el sector'} "${nombre}"?`)) return;
    try {
      await api.delete(`/geolocalizacion/${tipo === 'canton' ? 'cantones' : tipo === 'parroquia' ? 'parroquias' : 'sectores'}/${id}/`);
      if (tipo === 'canton') {
        const res = await api.get(`/geolocalizacion/cantones/?provincia=${provinciaSeleccionada.id}`);
        setCantones(res.data?.data || []);
        setFilterCanton('');
        setParroquias([]);
        setSectores([]);
      } else if (tipo === 'parroquia') {
        const res = await api.get(`/geolocalizacion/parroquias/?canton=${filterCanton}`);
        setParroquias(res.data?.data || []);
      } else {
        const res = await api.get(`/geolocalizacion/sectores/?parroquia=${filterParroquia}`);
        setSectores(res.data?.data || []);
      }
    } catch (err) {
      console.error(`Error al eliminar ${tipo}:`, err);
    }
  };
 
  return (
    <>
      {!paisSeleccionado ? (
        <>
          <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
            <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-bold text-on-surface">Geolocalización</span>
          </nav>

          <div className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Geolocalización</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Seleccione un país para ver sus provincias</p>
          </div>

          {loadingPaises ? (
            <div className="flex items-center justify-center py-xl">
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
                <p className="font-body-md text-on-surface-variant mt-md">Cargando países...</p>
              </div>
            </div>
          ) : paises.length === 0 ? (
            <div className="max-w-md mx-auto mt-xl bg-surface rounded-xl border border-outline-variant p-lg text-center">
              <span className="material-symbols-outlined text-[64px] text-on-surface-variant">public</span>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-md">No hay países registrados</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm mb-lg">Agregue el primer país para comenzar</p>
              <button onClick={() => openModal('pais')}
                className="h-11 px-lg bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all flex items-center gap-xs mx-auto">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Agregar País
              </button>
            </div>
          ) : (
            <>
              <div className="mb-lg flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Países ({paises.length})</h2>
                <button onClick={() => openModal('pais')}
                  className="h-10 px-md bg-primary text-on-primary rounded-lg font-label-md font-bold flex items-center gap-xs hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Agregar País
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
                {paises.map((pais, i) => (
                  <div
                    key={pais.id}
                    className="group bg-surface rounded-xl border border-outline-variant p-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                  >
                    <button onClick={() => setPaisSeleccionado(pais)} className="w-full text-left">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${COLORES_PAISES[i % COLORES_PAISES.length]} flex items-center justify-center mb-md`}>
                        <span className="material-symbols-outlined text-white text-[24px]">flag</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">{pais.nombre}</h3>
                    </button>
                    <button onClick={(e) => handleEliminarPais(pais.id, pais.nombre, e)}
                      className="mt-md flex items-center gap-xs w-full px-md py-1.5 text-danger border border-danger/30 rounded-lg text-sm hover:bg-error-container transition-all"
                      title="Eliminar país">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
            <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <button onClick={() => setPaisSeleccionado(null)} className="hover:text-primary">Geolocalización</button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-bold text-on-surface">{paisSeleccionado.nombre}</span>
          </nav>

          <div className="mb-lg">
            <button onClick={() => setPaisSeleccionado(null)} className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors mb-sm font-body-md">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Volver a países
            </button>
            <div className="flex items-center justify-between">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">{paisSeleccionado.nombre}</h1>
              <div className="flex gap-sm">
                <button onClick={() => openModal('pais', paisSeleccionado)}
                  className="h-10 px-md bg-surface-container-low border border-outline-variant rounded-lg font-label-md font-bold flex items-center gap-xs hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Editar País
                </button>
                <button onClick={() => {
                  if (confirm(`¿Eliminar el país "${paisSeleccionado.nombre}"?`)) {
                    api.delete(`/geolocalizacion/paises/${paisSeleccionado.id}/`).then(() => {
                      setPaisSeleccionado(null);
                      return api.get('/geolocalizacion/paises/');
                    }).then(res => setPaises(res.data?.data || [])).catch(console.error);
                  }
                }}
                  className="h-10 px-md border border-danger/30 text-danger rounded-lg font-label-md font-bold flex items-center gap-xs hover:bg-error-container transition-all">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Eliminar País
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="space-y-md">
              <div className="bg-surface rounded-xl border border-outline-variant p-lg">
                <div className="flex items-center justify-between mb-md">
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Provincias</h2>
                  <button onClick={() => openModal('provincia')}
                    className="h-10 px-md bg-primary text-on-primary rounded-lg font-label-md font-bold flex items-center gap-xs hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Agregar
                  </button>
                </div>

                {loadingProvincias ? (
                  <div className="flex items-center justify-center py-lg">
                    <span className="material-symbols-outlined text-[32px] text-primary animate-spin">autorenew</span>
                  </div>
                ) : provincias.length === 0 ? (
                  <div className="text-center py-lg">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant">map</span>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-sm">No hay provincias registradas</p>
                  </div>
                ) : (
                  <div className="space-y-sm">
                    {provincias.map(prov => (
                      <div key={prov.id}
                        onClick={() => setProvinciaSeleccionada(prov)}
                        className={`group flex items-center gap-sm p-md rounded-lg border cursor-pointer transition-all ${
                          provinciaSeleccionada?.id === prov.id
                            ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                            : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">map</span>
                        <span className="flex-1 font-body-md font-body-md font-medium">{prov.nombre}</span>
                        {prov.lat && prov.lng && (
                          <span className="material-symbols-outlined text-[16px] text-success">check_circle</span>
                        )}
                        <div className="flex gap-xs">
                          <button onClick={(e) => { e.stopPropagation(); openModal('provincia', prov); }}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Editar">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleEliminarProvincia(prov.id, prov.nombre); }}
                            className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Eliminar">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-md">
              <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
                <MapaLeaflet center={center} zoom={zoom} markers={markers} height="500px" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                {!provinciaSeleccionada
                  ? 'Seleccione una provincia para verla en el mapa'
                  : provinciaSeleccionada.lat && provinciaSeleccionada.lng
                    ? `Mostrando: ${provinciaSeleccionada.nombre}`
                    : 'Esta provincia no tiene coordenadas. Edítela para agregarlas.'}
              </p>
            </div>
          </div>

          {provinciaSeleccionada && (
            <div className="mt-xl border-t border-outline-variant pt-lg">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-md">Gestión Territorial</h2>

              <div className="flex items-center gap-xs mb-lg">
                {['cantones', 'parroquias', 'sectores'].map(nivel => (
                  <button
                    key={nivel}
                    onClick={() => {
                      setNivelJerarquia(nivel);
                      if (nivel === 'cantones') { setFilterCanton(''); setFilterParroquia(''); }
                      if (nivel === 'parroquias') setFilterParroquia('');
                    }}
                    className={`h-10 px-lg rounded-lg font-label-md font-bold transition-all ${
                      nivelJerarquia === nivel
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {nivel === 'cantones' ? 'Cantones' : nivel === 'parroquias' ? 'Parroquias' : 'Sectores'}
                  </button>
                ))}
              </div>

              {nivelJerarquia === 'parroquias' && (
                <div className="mb-md">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Filtrar por Cantón</label>
                  <select value={filterCanton} onChange={(e) => { setFilterCanton(e.target.value); setFilterParroquia(''); setSectores([]); }}
                    className="w-full max-w-xs h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                    <option value="">Seleccione un cantón</option>
                    {cantones.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              )}

              {nivelJerarquia === 'sectores' && (
                <div className="mb-md">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Filtrar por Parroquia</label>
                  <select value={filterParroquia} onChange={(e) => setFilterParroquia(e.target.value)}
                    className="w-full max-w-xs h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all">
                    <option value="">Seleccione una parroquia</option>
                    {parroquias.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between mb-md">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {nivelJerarquia === 'cantones' ? 'Cantones' : nivelJerarquia === 'parroquias' ? 'Parroquias' : 'Sectores'}
                  <span className="font-body-md text-on-surface-variant font-normal ml-sm">
                    ({nivelJerarquia === 'cantones' ? cantones.length : nivelJerarquia === 'parroquias' ? parroquias.length : sectores.length})
                  </span>
                </h3>
                <button onClick={() => openModal(
                  nivelJerarquia === 'cantones' ? 'canton' : nivelJerarquia === 'parroquias' ? 'parroquia' : 'sector'
                )}
                  disabled={(nivelJerarquia === 'parroquias' && !filterCanton) || (nivelJerarquia === 'sectores' && !filterParroquia)}
                  className="h-10 px-md bg-primary text-on-primary rounded-lg font-label-md font-bold flex items-center gap-xs hover:brightness-110 transition-all disabled:opacity-60">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Agregar
                </button>
              </div>

              <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low sticky top-0">
                      <tr>
                        <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">ID</th>
                        <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Nombre</th>
                        <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                          {nivelJerarquia === 'cantones' ? 'Provincia' : nivelJerarquia === 'parroquias' ? 'Cantón' : 'Parroquia'}
                        </th>
                        <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {loadingJerarquia ? (
                        <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">Cargando...</td></tr>
                      ) : (() => {
                        const items = nivelJerarquia === 'cantones' ? cantones : nivelJerarquia === 'parroquias' ? parroquias : sectores;
                        if (items.length === 0) {
                          const msg = nivelJerarquia === 'parroquias' && !filterCanton
                            ? 'Seleccione un cantón para ver sus parroquias'
                            : nivelJerarquia === 'sectores' && !filterParroquia
                              ? 'Seleccione una parroquia para ver sus sectores'
                              : `No hay ${nivelJerarquia} registrados`;
                          return <tr key="empty"><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">{msg}</td></tr>;
                        }
                        return items.map(item => (
                          <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-lg py-md font-body-md text-on-surface-variant">{item.id}</td>
                            <td className="px-lg py-md font-body-md text-on-surface font-medium">{item.nombre}</td>
                            <td className="px-lg py-md font-body-md text-on-surface-variant">
                              {item.provincia?.nombre || item.canton?.nombre || item.parroquia?.nombre || '-'}
                            </td>
                          <td className="px-lg py-md flex gap-xs">
                            <button onClick={() => openModal(
                              nivelJerarquia === 'cantones' ? 'canton' : nivelJerarquia === 'parroquias' ? 'parroquia' : 'sector',
                              item
                            )}
                              className="inline-flex items-center gap-xs px-md py-1 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary-fixed transition-all">
                              <span className="material-symbols-outlined text-[16px]">edit</span>Editar
                            </button>
                            <button onClick={() => handleEliminarJerarquia(
                              nivelJerarquia === 'cantones' ? 'canton' : nivelJerarquia === 'parroquias' ? 'parroquia' : 'sector',
                              item.id, item.nombre
                            )}
                              className="inline-flex items-center gap-xs px-md py-1 text-danger border border-danger/30 rounded-lg text-sm hover:bg-error-container transition-all">
                              <span className="material-symbols-outlined text-[16px]">delete</span>Eliminar
                            </button>
                          </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-[480px] mx-4 bg-surface rounded-xl border border-outline-variant shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editando
                  ? `Editar ${LABEL_NIVEL[modalLevel]}`
                  : `${PREFIX_NIVEL[modalLevel]} ${LABEL_NIVEL[modalLevel]}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-lg space-y-lg">
              {modalMsg && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${modalMsg.type === 'error' ? 'bg-error-container text-on-error-container border-error/20' : 'bg-primary-fixed text-on-primary-fixed border-primary/20'}`}>
                  <span className={`material-symbols-outlined ${modalMsg.type === 'error' ? 'text-error' : 'text-primary'}`}>{modalMsg.type === 'error' ? 'error' : 'check_circle'}</span>
                  <p className="font-body-md flex-1">{modalMsg.text}</p>
                </div>
              )}
              {modalLevel === 'provincia' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">País</label>
                  <p className="font-body-md font-bold text-on-surface">{paisSeleccionado.nombre}</p>
                </div>
              )}
              {modalLevel === 'canton' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Provincia</label>
                  <p className="font-body-md font-bold text-on-surface">{provinciaSeleccionada.nombre}</p>
                </div>
              )}
              {modalLevel === 'parroquia' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Cantón</label>
                  {editando ? (
                    <select value={formParentId} onChange={(e) => setFormParentId(e.target.value)}
                      className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" required>
                      <option value="">Seleccione un cantón</option>
                      {cantones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  ) : (
                    <p className="font-body-md font-bold text-on-surface">
                      {cantones.find(c => c.id == filterCanton)?.nombre}
                    </p>
                  )}
                </div>
              )}
              {modalLevel === 'sector' && (
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Parroquia</label>
                  {editando ? (
                    <select value={formParentId} onChange={(e) => setFormParentId(e.target.value)}
                      className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" required>
                      <option value="">Seleccione una parroquia</option>
                      {parroquias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  ) : (
                    <p className="font-body-md font-bold text-on-surface">
                      {parroquias.find(p => p.id == filterParroquia)?.nombre}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalNombre">Nombre</label>
                <input id="modalNombre" name="nombre" type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                  required autoFocus maxLength={100} placeholder={`Nombre de ${modalLevel === 'pais' ? 'país' : modalLevel === 'provincia' ? 'provincia' : modalLevel === 'canton' ? 'cantón' : modalLevel === 'parroquia' ? 'parroquia' : 'sector'}`} />
              </div>
              {modalLevel === 'provincia' && (
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalLat">Latitud</label>
                    <input id="modalLat" name="lat" type="number" step="any" value={formLat} onChange={(e) => setFormLat(e.target.value)}
                      className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                      placeholder="-3.9931" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalLng">Longitud</label>
                    <input id="modalLng" name="lng" type="number" step="any" value={formLng} onChange={(e) => setFormLng(e.target.value)}
                      className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                      placeholder="-79.2042" />
                  </div>
                  <p className="col-span-2 font-body-sm text-body-sm text-on-surface-variant -mt-sm">Deje vacío si no conoce las coordenadas</p>
                </div>
              )}
              <div className="flex justify-end gap-md pt-sm">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-xl h-10 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting || !formNombre.trim()}
                  className="px-xl h-10 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-60">
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
