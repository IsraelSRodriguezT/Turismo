import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function AdminReportes() {
  const [showForm, setShowForm] = useState(false);
  const [tipoReporte, setTipoReporte] = useState('atractivos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // States for counts
  const [totalAtractivos, setTotalAtractivos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalInvestigaciones, setTotalInvestigaciones] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load stats from API
  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const [resAtractivos, resUsuarios, resProyectos] = await Promise.all([
        api.get('/atractivos/atractivos/'),
        api.get('/usuarios/usuarios-admin/'),
        api.get('/investigacion/proyectos/'),
      ]);
      setTotalAtractivos((resAtractivos.data.data || []).length);
      setTotalUsuarios((resUsuarios.data.data || []).length);
      setTotalInvestigaciones((resProyectos.data.data || []).length);
    } catch (err) {
      console.error("Error al cargar estadísticas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reporte de tipo "${tipoReporte}" generado desde ${fechaInicio} hasta ${fechaFin} con éxito.`);
    
    // Simulate generation by downloading a template/dummy CSV file
    const headers = 'ID,Nombre/Titulo,Fecha/Detalle\n';
    let rows = '';
    if (tipoReporte === 'atractivos') {
      rows = '1,Parque Nacional Podocarpus,Libre\n2,Basílica de El Cisne,Libre\n3,Valle de Vilcabamba,Libre\n';
    } else if (tipoReporte === 'usuarios') {
      rows = '1,carlos,Administrador\n2,turista,Turista\n';
    } else {
      rows = '1,Análisis de Flora Urbana,En curso\n';
    }
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_${tipoReporte}_${fechaInicio}_a_${fechaFin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTipoReporte('atractivos');
    setFechaInicio('');
    setFechaFin('');
    setShowForm(false);
  };

  // Client-side CSV export helper for all users
  const exportarUsuariosCSV = async () => {
    try {
      const res = await api.get('/usuarios/usuarios-admin/');
      const usuarios = res.data.data || [];
      if (usuarios.length === 0) {
        alert("No hay usuarios registrados para exportar.");
        return;
      }
      const headers = 'ID,Nickname,Email,Estado,Superusuario,Staff\n';
      const rows = usuarios.map(u => 
        `"${u.id}","${u.nickname}","${u.email}","${u.is_active ? 'Activo' : 'Inactivo'}","${u.is_superuser}","${u.is_staff}"`
      ).join('\n');
      
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "reporte_usuarios.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("No se pudieron exportar los usuarios.");
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/admin/reportes" onClick={() => setShowForm(false)} className="hover:text-primary">Reportes Administrativos</Link>
        {showForm && (
          <>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-bold text-on-surface">Generar Reporte</span>
          </>
        )}
      </nav>

      {showForm ? (
        <div className="bg-surface rounded-xl border border-outline-variant p-lg max-w-[600px] mx-auto shadow-sm">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">Generar Nuevo Reporte</h2>
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="tipoReporte">
                Tipo de Reporte <span className="text-danger">*</span>
              </label>
              <select
                id="tipoReporte"
                required
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
              >
                <option value="atractivos">Atractivos más visitados</option>
                <option value="usuarios">Usuarios registrados</option>
                <option value="actividad">Actividad de investigación</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="fechaInicio">
                  Fecha de Inicio <span className="text-danger">*</span>
                </label>
                <input
                  id="fechaInicio"
                  required
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="fechaFin">
                  Fecha de Fin <span className="text-danger">*</span>
                </label>
                <input
                  id="fechaFin"
                  required
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all"
                />
              </div>
            </div>
            <div className="space-y-md">
              <button type="submit" className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
                Generar Reporte
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="w-full py-3 border border-outline-variant text-on-surface rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-all flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Volver
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-lg">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Reportes Administrativos</h1>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
              <span className="material-symbols-outlined">add</span>Generar Reporte
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-lg">
            <div className="bg-surface rounded-xl border border-outline-variant p-lg">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Resumen General</h2>
              <div className="space-y-md">
                <div className="flex justify-between p-md bg-surface-container-low rounded-lg">
                  <span className="font-body-md text-on-surface">Total Atractivos</span>
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    {loading ? 'Cargando...' : totalAtractivos}
                  </span>
                </div>
                <div className="flex justify-between p-md bg-surface-container-low rounded-lg">
                  <span className="font-body-md text-on-surface">Total Usuarios</span>
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    {loading ? 'Cargando...' : totalUsuarios}
                  </span>
                </div>
                <div className="flex justify-between p-md bg-surface-container-low rounded-lg">
                  <span className="font-body-md text-on-surface">Total Investigaciones</span>
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    {loading ? 'Cargando...' : totalInvestigaciones}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-xl border border-outline-variant p-lg">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Exportar Datos</h2>
              <div className="space-y-md">
                <button 
                  onClick={exportarUsuariosCSV}
                  className="w-full flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all"
                >
                  <span className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <span className="font-body-md text-body-md">Exportar Usuarios (CSV)</span>
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">download</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
