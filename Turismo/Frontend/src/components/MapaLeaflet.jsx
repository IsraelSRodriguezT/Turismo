import { useEffect, useRef } from 'react';

const COLORES_RUTAS = [
  '#E53935', '#1E88E5', '#43A047', '#FB8C00',
  '#8E24AA', '#00ACC1', '#F4511E', '#3949AB',
];

export default function MapaLeaflet({
  center = [-3.9931, -79.2042],
  zoom = 10,
  markers = [],
  routes = [],
  className = '',
  height = '420px',
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (!window.L) {
      console.error('Leaflet (window.L) no está disponible. Revisa el script en index.html.');
      return;
    }
    if (mapInstanceRef.current) return;

    const L = window.L;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function limpiarCapas() {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];
  }

  function agregarMarcadores() {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    const iconoPersonalizado = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    markers.forEach(({ lat, lng, titulo, descripcion }) => {
      const popup = descripcion
        ? `<b>${titulo}</b><br/>${descripcion}`
        : `<b>${titulo}</b>`;
      const marker = L.marker([lat, lng], { icon: iconoPersonalizado })
        .addTo(map)
        .bindPopup(popup);
      layersRef.current.push(marker);
    });
  }

  function agregarRutas() {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    routes.forEach((ruta, index) => {
      const puntos = (ruta.puntos || []).filter(p => p.lat != null && p.lng != null);
      if (puntos.length < 2) return;

      const color = ruta.color || COLORES_RUTAS[index % COLORES_RUTAS.length];

      const polyline = L.polyline(
        puntos.map(p => [p.lat, p.lng]),
        {
          color,
          weight: 4,
          opacity: 0.8,
          dashArray: null,
        }
      ).addTo(map);
      polyline.bindPopup(`<b>${ruta.nombre}</b>`);
      layersRef.current.push(polyline);

      puntos.forEach((p, i) => {
        const iconoRuta = L.divIcon({
          html: `<div style="background:${color};color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3)">${i + 1}</div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const nombresAtractivos = (ruta.nombresAtractivos || []);
        const titulo = nombresAtractivos[i] || `Parada ${i + 1}`;
        const marker = L.marker([p.lat, p.lng], { icon: iconoRuta })
          .addTo(map)
          .bindPopup(`<b>${titulo}</b>`);
        layersRef.current.push(marker);
      });
    });
  }

  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;
    mapInstanceRef.current.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    limpiarCapas();
    agregarMarcadores();
    agregarRutas();
  }, [markers, routes]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ height, width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    />
  );
}
