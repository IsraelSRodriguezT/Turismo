import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapaLeaflet from '../../components/MapaLeaflet';
import api from '../../services/httpClient';

// Coordenadas de atractivos conocidos de Loja (usadas cuando no hay ubicación en DB)
const UBICACIONES_CONOCIDAS = {
  'Parque Nacional Podocarpus':  { lat: -4.1048, lng: -79.1630 },
  'Basílica de El Cisne':        { lat: -3.7547, lng: -79.5647 },
  'Valle de Vilcabamba':         { lat: -4.2600, lng: -79.2217 },
  'Parque Central de Loja':      { lat: -3.9992, lng: -79.2059 },
  'Puerta de la Ciudad':         { lat: -3.9945, lng: -79.2080 },
  'Catedral de la Inmaculada':   { lat: -3.9992, lng: -79.2042 },
  'Jardín Botánico Reinaldo Espinosa': { lat: -3.9995, lng: -79.2020 },
};

const CENTRO_LOJA = [-3.9931, -79.2042];

export default function ExploradorAtractivos() {
  const [atractivos, setAtractivos] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroClasificacion, setFiltroClasificacion] = useState('');
  const [filtroProvincia, setFiltroProvincia] = useState('');
  const [filtroAccesibilidad, setFiltroAccesibilidad] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [totalAtractivos, setTotalAtractivos] = useState(0);
  const [totalClasificaciones, setTotalClasificaciones] = useState(0);
  const [center, setCenter] = useState(CENTRO_LOJA);
  const [zoom, setZoom] = useState(10);

  const cargarDatos = async (paramOverrides) => {
    setLoading(true);
    try {
      const params = paramOverrides || {};
      if (!paramOverrides) {
        if (filtroClasificacion) params.clasificacion = filtroClasificacion;
        if (filtroAccesibilidad) params.nivel_accesibilidad = filtroAccesibilidad;
        if (filtroBusqueda) params.search = filtroBusqueda;
      }

      const [resAtrac, resClasif, resProv] = await Promise.all([
        api.get('/atractivos/atractivos/', { params }),
        api.get('/atractivos/clasificaciones/'),
        api.get('/geolocalizacion/provincias/'),
      ]);

      const atractivosData = resAtrac.data.data || [];
      const clasificacionesData = resClasif.data.data || [];
      const provinciasData = resProv.data.data || [];

      setAtractivos(atractivosData);
      setClasificaciones(clasificacionesData);
      setProvincias(provinciasData);
      setTotalAtractivos(atractivosData.length);
      setTotalClasificaciones(clasificacionesData.length);

      // Construir marcadores desde ubicaciones en DB
      const marcadores = atractivosData
        .map(a => {
          let lat, lng;
          if (a.ubicacion?.latitud && a.ubicacion?.longitud) {
            lat = a.ubicacion.latitud;
            lng = a.ubicacion.longitud;
          } else if (UBICACIONES_CONOCIDAS[a.nombre]) {
            lat = UBICACIONES_CONOCIDAS[a.nombre].lat;
            lng = UBICACIONES_CONOCIDAS[a.nombre].lng;
          }
          if (!lat || !lng) return null;
          return {
            lat,
            lng,
            titulo: a.nombre,
            descripcion: `Accesibilidad: ${a.nivel_accesibilidad || 'N/A'} | Estado: ${a.estado_conservacion || 'N/A'}`,
          };
        })
        .filter(Boolean);

      setMarkers(marcadores);
    } catch (err) {
      console.error('Error al cargar atractivos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (!filtroProvincia || provincias.length === 0) {
      setCenter(CENTRO_LOJA);
      setZoom(10);
      return;
    }
    const provincia = provincias.find(p => String(p.id) === String(filtroProvincia));
    if (provincia?.lat && provincia?.lng) {
      setCenter([Number(provincia.lat), Number(provincia.lng)]);
      setZoom(8);
    }
  }, [filtroProvincia, provincias]);

  const aplicarFiltros = () => { cargarDatos(); };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Explorador</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left: Province selector + Filters */}
        <div className="space-y-md">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Provincias</h2>
            {loading ? (
              <div className="flex items-center justify-center py-lg">
                <span className="material-symbols-outlined text-[32px] text-primary animate-spin">autorenew</span>
              </div>
            ) : (
              <div className="space-y-sm">
                {provincias.map(prov => (
                  <div key={prov.id}
                    onClick={() => setFiltroProvincia(String(prov.id))}
                    className={`flex items-center gap-sm p-md rounded-lg border cursor-pointer transition-all ${
                      filtroProvincia === String(prov.id)
                        ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                        : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">map</span>
                    <span className="flex-1 font-body-md font-medium">{prov.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Filtros</h2>
            <div className="space-y-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Buscar</label>
                <input type="text" value={filtroBusqueda} onChange={e => setFiltroBusqueda(e.target.value)}
                  placeholder="Nombre del atractivo..."
                  className="w-full px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Accesibilidad</label>
                <select value={filtroAccesibilidad} onChange={e => setFiltroAccesibilidad(e.target.value)}
                  className="w-full px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none">
                  <option value="">Todas</option>
                  <option value="LIBRE">Libre</option>
                  <option value="RESTRINGIDO">Restringido</option>
                  <option value="PAGADO">Pagado</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Clasificación</label>
                <select value={filtroClasificacion} onChange={e => setFiltroClasificacion(e.target.value)}
                  className="w-full px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none">
                  <option value="">Todas</option>
                  {clasificaciones.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <button onClick={aplicarFiltros}
                className="w-full py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
                Aplicar Filtros
              </button>
              {(filtroClasificacion || filtroAccesibilidad || filtroBusqueda) && (
                <button onClick={() => { setFiltroClasificacion(''); setFiltroAccesibilidad(''); setFiltroBusqueda(''); cargarDatos({}); }}
                  className="w-full py-2 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Map + Stats + List */}
        <div className="lg:col-span-2 space-y-md">
          {/* Map */}
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            {loading ? (
              <div className="h-[512px] flex items-center justify-center bg-surface-container-low">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
                  <p className="font-body-md text-on-surface-variant mt-md">Cargando atractivos...</p>
                </div>
              </div>
            ) : (
              <MapaLeaflet center={center} zoom={zoom} markers={markers} height="512px" />
            )}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            📍 Haz clic en los marcadores para ver detalles del atractivo turístico
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
              <span className="material-symbols-outlined text-[32px] text-primary">add_location</span>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-sm" id="totalAtractivosMapa">
                {loading ? '...' : totalAtractivos}
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">Atractivos</p>
            </div>
            <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
              <span className="material-symbols-outlined text-[32px] text-primary">category</span>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-sm">
                {loading ? '...' : totalClasificaciones}
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">Clasificaciones</p>
            </div>
            <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
              <span className="material-symbols-outlined text-[32px] text-primary">location_on</span>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-sm">
                {loading ? '...' : markers.length}
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">En el mapa</p>
            </div>
          </div>

          {/* Lista de atractivos */}
          {atractivos.length > 0 && (
            <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Atractivos Turísticos ({atractivos.length})
                </h3>
              </div>
              <div className="divide-y divide-outline-variant max-h-[300px] overflow-y-auto">
                {atractivos.map(a => (
                  <div key={a.id} className="px-lg py-sm flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-primary text-[20px]">place</span>
                      <div>
                        <p className="font-body-md text-on-surface font-medium">{a.nombre}</p>
                        <p className="font-body-sm text-on-surface-variant text-xs">
                          {a.nivel_accesibilidad} · {a.estado_conservacion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
