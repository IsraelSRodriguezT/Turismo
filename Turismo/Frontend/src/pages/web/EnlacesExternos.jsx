import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

const ICONOS_TIPO = {
  CLIMA: 'thunderstorm',
  ESTADO_VIAS: 'road',
  GAD: 'account_balance',
  TRANSPORTE: 'directions_bus',
  ALOJAMIENTO: 'hotel',
  GASTRONOMIA: 'restaurant',
  OTRO: 'link',
};

export default function EnlacesExternos() {
  const [enlaces, setEnlaces] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCanton, setFiltroCanton] = useState('');
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroCanton) params.canton = filtroCanton;

      const [resEnl, resCant] = await Promise.all([
        api.get('/geolocalizacion/enlaces-externos/', { params }),
        api.get('/geolocalizacion/cantones/'),
      ]);

      setEnlaces(resEnl.data?.data || []);
      setCantones(resCant.data?.data || []);
    } catch (err) {
      console.error('Error al cargar enlaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const TIPOS = [
    { value: '', label: 'Todos' },
    { value: 'CLIMA', label: 'Clima' },
    { value: 'ESTADO_VIAS', label: 'Estado de Vías' },
    { value: 'GAD', label: 'GAD Cantonales' },
    { value: 'TRANSPORTE', label: 'Transporte' },
    { value: 'ALOJAMIENTO', label: 'Alojamiento' },
    { value: 'GASTRONOMIA', label: 'Gastronomía' },
    { value: 'OTRO', label: 'Otros Servicios' },
  ];

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Enlaces Externos</span>
      </nav>

      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Enlaces Externos</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Clima, estado de vías, GAD cantonales y otros servicios</p>
      </div>

      <div className="flex flex-wrap gap-md mb-lg">
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
          className="px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none"
        >
          {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={filtroCanton} onChange={e => setFiltroCanton(e.target.value)}
          className="px-md py-2 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none"
        >
          <option value="">Todos los cantones</option>
          {cantones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <button onClick={cargarDatos}
          className="px-md py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all"
        >
          Filtrar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-xl">
          <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
        </div>
      ) : enlaces.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-sm">link_off</span>
          <p className="font-body-md">No hay enlaces externos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {enlaces.map(enlace => (
            <a key={enlace.id} href={enlace.url} target="_blank" rel="noopener noreferrer"
              className="bg-surface rounded-xl border border-outline-variant p-lg hover:shadow-md hover:border-primary transition-all block"
            >
              <div className="flex items-start gap-md">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">
                    {ICONOS_TIPO[enlace.tipo] || 'link'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-label-md text-label-md font-bold text-on-surface">{enlace.nombre}</h3>
                  <span className="inline-block px-2 py-0.5 mt-1 bg-surface-container-low text-on-surface-variant rounded-full font-badge text-badge">
                    {enlace.tipo_display || enlace.tipo}
                  </span>
                  {enlace.descripcion && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm line-clamp-2">{enlace.descripcion}</p>
                  )}
                  <p className="font-body-sm text-body-sm text-primary mt-sm truncate">{enlace.url}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0">open_in_new</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}