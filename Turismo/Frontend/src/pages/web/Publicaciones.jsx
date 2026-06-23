import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
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

      const [resPub, resCant] = await Promise.all([
        api.get('/inventario/publicaciones/', { params }),
        api.get('/geolocalizacion/cantones/'),
      ]);

      setPublicaciones(resPub.data?.data || []);
      setCantones(resCant.data?.data || []);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const TIPOS = [
    { value: '', label: 'Todos' },
    { value: 'INFOGRAFIA', label: 'Infografías' },
    { value: 'MATERIAL_VISUAL', label: 'Material Visual' },
    { value: 'PRESENTACION', label: 'Presentaciones' },
    { value: 'MAPA_TEMATICO', label: 'Mapas Temáticos' },
  ];

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Publicaciones</span>
      </nav>

      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Publicaciones y Material Visual</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Infografías y materiales visuales por cantón, ruta o atractivo turístico</p>
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
      ) : publicaciones.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-sm">publish</span>
          <p className="font-body-md">No hay publicaciones disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {publicaciones.map(pub => (
            <div key={pub.id} className="bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
              {pub.archivo ? (
                <div className="h-48 bg-surface-container-low flex items-center justify-center overflow-hidden">
                  {pub.archivo.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                    <img src={pub.archivo} alt={pub.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[64px] text-primary">description</span>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-[64px] text-primary">publish</span>
                </div>
              )}
              <div className="p-lg">
                <div className="flex items-center gap-sm mb-sm">
                  <span className="px-2 py-0.5 bg-primary-fixed text-primary rounded-full font-badge text-badge">
                    {pub.tipo_display || pub.tipo}
                  </span>
                  {pub.canton_nombre && (
                    <span className="px-2 py-0.5 bg-secondary-container text-secondary rounded-full font-badge text-badge">
                      {pub.canton_nombre}
                    </span>
                  )}
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-sm">{pub.titulo}</h3>
                {pub.descripcion && (
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">{pub.descripcion}</p>
                )}
                {pub.atractivo_nombre && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] align-middle">place</span> {pub.atractivo_nombre}
                  </p>
                )}
                {pub.ruta_nombre && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] align-middle">alt_route</span> {pub.ruta_nombre}
                  </p>
                )}
                <div className="flex gap-sm mt-md">
                  {pub.archivo && (
                    <a href={pub.archivo} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-xs px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span> Descargar
                    </a>
                  )}
                  {pub.url_externa && (
                    <a href={pub.url_externa} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-xs px-3 py-1.5 border border-outline text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span> Ver
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}