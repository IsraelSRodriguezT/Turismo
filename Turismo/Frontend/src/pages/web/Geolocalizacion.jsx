import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapaLeaflet from '../../components/MapaLeaflet';
import api from '../../services/httpClient';

// Coordenadas aproximadas de los cantones de Loja
const COORDENADAS_CANTONES_LOJA = {
  'Loja':           { lat: -3.9931,  lng: -79.2042 },
  'Catamayo':       { lat: -3.9889,  lng: -79.3558 },
  'Calvas':         { lat: -4.4000,  lng: -79.6000 },
  'Celica':         { lat: -4.1000,  lng: -79.9500 },
  'Chaguarpamba':   { lat: -3.9667,  lng: -79.6500 },
  'Espíndola':      { lat: -4.5000,  lng: -79.5833 },
  'Gonzanamá':      { lat: -4.2333,  lng: -79.4500 },
  'Macará':         { lat: -4.3833,  lng: -79.9500 },
  'Paltas':         { lat: -3.9833,  lng: -79.6833 },
  'Puyango':        { lat: -3.8833,  lng: -80.0000 },
  'Quilanga':       { lat: -4.5167,  lng: -79.4333 },
  'Saraguro':       { lat: -3.6333,  lng: -79.2333 },
  'Sozoranga':      { lat: -4.3167,  lng: -79.7833 },
  'Zapotillo':      { lat: -4.3667,  lng: -80.2333 },
  'Pindal':         { lat: -3.9833,  lng: -80.1833 },
  'Olmedo':         { lat: -3.9833,  lng: -79.7333 },
};

// Centro de la provincia de Loja
const CENTRO_LOJA = [-4.0, -79.5];

export default function Geolocalizacion() {
  const [cantones, setCantones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [totalCantones, setTotalCantones] = useState(0);
  const [totalProvincias, setTotalProvincias] = useState(0);
  const [totalParroquias, setTotalParroquias] = useState(0);
  const [totalSectores, setTotalSectores] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [resProv, resCant, resPar, resSec] = await Promise.all([
          api.get('/geolocalizacion/provincias/'),
          api.get('/geolocalizacion/cantones/'),
          api.get('/geolocalizacion/parroquias/'),
          api.get('/geolocalizacion/sectores/'),
        ]);

        const provinciasData = resProv.data.data || [];
        const cantonesData = resCant.data.data || [];
        const parroquiasData = resPar.data.data || [];
        const sectoresData = resSec.data.data || [];

        setProvincias(provinciasData);
        setCantones(cantonesData);
        setTotalProvincias(provinciasData.length);
        setTotalCantones(cantonesData.length);
        setTotalParroquias(parroquiasData.length);
        setTotalSectores(sectoresData.length);

        // Crear marcadores de cantones en el mapa usando coordenadas conocidas
        const marcadores = cantonesData
          .filter(c => {
            const nombreCanton = c.nombre;
            return COORDENADAS_CANTONES_LOJA[nombreCanton] !== undefined;
          })
          .map(c => {
            const coords = COORDENADAS_CANTONES_LOJA[c.nombre];
            const provincia = c.provincia?.nombre || 'Provincia desconocida';
            return {
              lat: coords.lat,
              lng: coords.lng,
              titulo: `Cantón ${c.nombre}`,
              descripcion: `Provincia: ${provincia}`,
            };
          });

        // Si no hay cantones con coordenadas conocidas, poner marcador en Loja
        if (marcadores.length === 0) {
          marcadores.push({
            lat: -3.9931,
            lng: -79.2042,
            titulo: 'Loja',
            descripcion: 'Capital provincial de Loja, Ecuador',
          });
        }

        setMarkers(marcadores);
      } catch (err) {
        console.error('Error al cargar datos de geolocalización:', err);
        // Marcador por defecto si no hay datos
        setMarkers([{
          lat: -3.9931,
          lng: -79.2042,
          titulo: 'Loja, Ecuador',
          descripcion: 'Provincia de Loja',
        }]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Geolocalización</span>
      </nav>

      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mapa Interactivo de la Provincia</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Visualización de información turística por cantón</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Panel lateral con estadísticas */}
        <div className="space-y-md">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Jerarquía Territorial</h2>
            <div className="space-y-md">
              <div className="p-md bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Provincias</p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    {loading ? '...' : totalProvincias}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">map</span>
              </div>
              <div className="p-md bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Cantones</p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    {loading ? '...' : totalCantones}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">location_city</span>
              </div>
              <div className="p-md bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Parroquias</p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    {loading ? '...' : totalParroquias}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">holiday_village</span>
              </div>
              <div className="p-md bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Sectores</p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    {loading ? '...' : totalSectores}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">place</span>
              </div>
            </div>
          </div>

          {/* Lista de cantones en el mapa */}
          {cantones.length > 0 && (
            <div className="bg-surface rounded-xl border border-outline-variant p-lg">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Cantones en el Mapa</h2>
              <div className="space-y-sm max-h-[200px] overflow-y-auto pr-sm">
                {cantones.map(c => (
                  <div key={c.id} className="flex items-center gap-sm p-sm bg-surface-container-low rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[18px]">place</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{c.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mapa Leaflet */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center bg-surface-container-low">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
                  <p className="font-body-md text-on-surface-variant mt-md">Cargando mapa...</p>
                </div>
              </div>
            ) : (
              <MapaLeaflet
                center={CENTRO_LOJA}
                zoom={9}
                markers={markers}
                height="500px"
              />
            )}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm text-center">
            📍 Haz clic en los marcadores del mapa para ver información de cada cantón
          </p>
        </div>
      </div>
    </>
  );
}
