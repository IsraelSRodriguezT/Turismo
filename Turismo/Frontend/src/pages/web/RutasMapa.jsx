import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapaLeaflet from '../../components/MapaLeaflet';
import api from '../../services/httpClient';

const CENTRO_LOJA = [-3.9931, -79.2042];

const COLORES_DISPONIBLES = [
  '#E53935', '#1E88E5', '#43A047', '#FB8C00',
  '#8E24AA', '#00ACC1', '#F4511E', '#3949AB',
];

export default function RutasMapa() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarRutas = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/atractivos/rutas/con_mapa/');
        const rutasData = res.data?.data || [];
        setRutas(rutasData);

        if (rutasData.length > 0) {
          seleccionarRuta(rutasData[0], rutasData);
        } else {
          setMarkers([{
            lat: -3.9931,
            lng: -79.2042,
            titulo: 'Loja, Ecuador',
            descripcion: 'No hay rutas registradas',
          }]);
          setRoutes([]);
        }
      } catch (err) {
        console.error('Error al cargar rutas:', err);
        setError('No se pudieron cargar las rutas turísticas.');
        setMarkers([{
          lat: -3.9931,
          lng: -79.2042,
          titulo: 'Loja, Ecuador',
          descripcion: 'Error al cargar datos',
        }]);
      } finally {
        setLoading(false);
      }
    };
    cargarRutas();
  }, []);

  function seleccionarRuta(ruta, todasRutas = rutas) {
    setRutaSeleccionada(ruta);

    const puntos = (ruta.detalles_ruta || [])
      .filter(d => d.atractivo?.latitud != null && d.atractivo?.longitud != null)
      .map(d => ({
        lat: d.atractivo.latitud,
        lng: d.atractivo.longitud,
      }));

    const nombresAtractivos = (ruta.detalles_ruta || [])
      .filter(d => d.atractivo?.latitud != null && d.atractivo?.longitud != null)
      .map(d => d.atractivo.nombre);

    const marcadores = (ruta.detalles_ruta || [])
      .filter(d => d.atractivo?.latitud != null && d.atractivo?.longitud != null)
      .map(d => ({
        lat: d.atractivo.latitud,
        lng: d.atractivo.longitud,
        titulo: d.atractivo.nombre,
        descripcion: `Orden: ${d.orden} | Estado vía: ${d.estado}`,
      }));

    const todasRutasMapa = todasRutas.map((r, i) => {
      const pts = (r.detalles_ruta || [])
        .filter(d => d.atractivo?.latitud != null && d.atractivo?.longitud != null)
        .map(d => ({
          lat: d.atractivo.latitud,
          lng: d.atractivo.longitud,
        }));
      const nombres = (r.detalles_ruta || [])
        .filter(d => d.atractivo?.latitud != null && d.atractivo?.longitud != null)
        .map(d => d.atractivo.nombre);
      return {
        nombre: r.nombre,
        puntos: pts,
        nombresAtractivos: nombres,
        color: r.id === ruta.id ? COLORES_DISPONIBLES[i % COLORES_DISPONIBLES.length] : undefined,
        opacity: r.id === ruta.id ? 0.9 : 0.3,
      };
    });

    setMarkers(marcadores);
    setRoutes(todasRutasMapa);
  }

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Rutas Turísticas</span>
      </nav>

      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Rutas Turísticas en el Mapa</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Integración de rutas turísticas dentro del mapa interactivo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
        <div className="space-y-md">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Rutas Disponibles</h2>
            {loading ? (
              <div className="flex items-center gap-md py-md">
                <span className="material-symbols-outlined text-primary animate-spin">autorenew</span>
                <span className="font-body-md text-on-surface-variant">Cargando rutas...</span>
              </div>
            ) : error ? (
              <div className="p-md bg-error-container text-error rounded-lg font-body-md">
                <span className="material-symbols-outlined text-[18px] align-middle mr-xs">error</span>
                {error}
              </div>
            ) : rutas.length === 0 ? (
              <div className="text-center py-md text-on-surface-variant font-body-md">
                <span className="material-symbols-outlined text-[32px] block mb-sm">route</span>
                No hay rutas registradas
              </div>
            ) : (
              <div className="space-y-sm">
                {rutas.map((ruta, i) => (
                  <button
                    key={ruta.id}
                    onClick={() => seleccionarRuta(ruta)}
                    className={`w-full flex items-center gap-md p-md rounded-lg text-left transition-all ${
                      rutaSeleccionada?.id === ruta.id
                        ? 'bg-primary-container text-primary border border-primary'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container border border-transparent'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORES_DISPONIBLES[i % COLORES_DISPONIBLES.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-label-md font-medium truncate">{ruta.nombre}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {ruta.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {(ruta.detalles_ruta || []).length} paradas
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {rutaSeleccionada && (
            <div className="bg-surface rounded-xl border border-outline-variant p-lg">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">
                Detalle de Ruta
              </h2>
              <div className="space-y-sm">
                <p className="font-body-md text-body-md text-on-surface">
                  <span className="font-bold">Nombre:</span> {rutaSeleccionada.nombre}
                </p>
                {rutaSeleccionada.descripcion && (
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {rutaSeleccionada.descripcion}
                  </p>
                )}
                <p className="font-body-md text-body-md text-on-surface">
                  <span className="font-bold">Dificultad:</span>{' '}
                  {'★'.repeat(rutaSeleccionada.nivel_dificultad || 1)}
                  {'☆'.repeat(5 - (rutaSeleccionada.nivel_dificultad || 1))}
                </p>
                <div className="border-t border-outline-variant pt-md mt-md">
                  <h3 className="font-label-md text-label-md font-bold text-on-surface mb-sm">Paradas</h3>
                  <div className="space-y-sm max-h-[200px] overflow-y-auto">
                    {(rutaSeleccionada.detalles_ruta || [])
                      .sort((a, b) => a.orden - b.orden)
                      .map((detalle, i) => (
                        <div key={detalle.id} className="flex items-center gap-sm p-sm bg-surface-container-low rounded-lg">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: COLORES_DISPONIBLES[0] }}
                          >
                            {detalle.orden}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body-sm text-body-sm text-on-surface truncate">
                              {detalle.atractivo?.nombre || 'Atractivo'}
                            </p>
                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                              Estado vía: {detalle.estado}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            {loading ? (
              <div className="h-[512px] flex items-center justify-center bg-surface-container-low">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
                  <p className="font-body-md text-on-surface-variant mt-md">Cargando rutas...</p>
                </div>
              </div>
            ) : (
              <MapaLeaflet
                center={CENTRO_LOJA}
                zoom={10}
                markers={markers}
                routes={routes}
                height="512px"
              />
            )}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm text-center">
            Selecciona una ruta del panel izquierdo para visualizarla en el mapa
          </p>

          {rutas.length > 0 && (
            <div className="mt-lg grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
                <span className="material-symbols-outlined text-[32px] text-primary">alt_route</span>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-sm">
                  {rutas.length}
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant">Rutas disponibles</p>
              </div>
              <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
                <span className="material-symbols-outlined text-[32px] text-primary">tour</span>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-sm">
                  {rutaSeleccionada ? (rutaSeleccionada.detalles_ruta || []).length : 0}
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant">Paradas en ruta</p>
              </div>
              <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
                <span className="material-symbols-outlined text-[32px] text-primary">map</span>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface mt-sm">
                  {rutaSeleccionada?.nivel_dificultad || '-'}
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant">Nivel dificultad</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}