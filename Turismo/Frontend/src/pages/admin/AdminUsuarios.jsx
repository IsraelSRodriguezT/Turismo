import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/usuarios/usuarios-admin/');
      setUsuarios(res.data.data || []);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (id, nickname) => {
    if (!confirm(`¿Eliminar al usuario "${nickname}"?`)) return;
    try {
      await api.delete(`/usuarios/usuarios-admin/${id}/`);
      cargarUsuarios();
    } catch {
      alert('No se pudo eliminar el usuario.');
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Administración de Usuarios</span>
      </nav>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Gestión de Usuarios</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: {usuarios.length} registros</p>
        </div>
        <div className="flex gap-md">
          <Link to="/registro-usuario" className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
            <span className="material-symbols-outlined">person_add</span>Nuevo Usuario
          </Link>
        </div>
      </div>
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low sticky top-0">
              <tr>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">ID</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Usuario</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Correo</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Estado</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan="5" className="px-lg py-md text-center text-on-surface-variant font-body-md">Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="px-lg py-md text-center text-danger font-body-md">{error}</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="5" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay usuarios registrados</td></tr>
              ) : usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-lg py-md font-body-md text-on-surface-variant">{u.id}</td>
                  <td className="px-lg py-md font-body-md text-on-surface font-medium">{u.nickname}</td>
                  <td className="px-lg py-md font-body-md text-on-surface-variant">{u.email}</td>
                  <td className="px-lg py-md font-body-md text-on-surface-variant">
                    <span className={`inline-flex items-center px-md py-0.5 rounded-full text-xs font-bold ${u.is_active ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                      {u.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-lg py-md">
                    <button onClick={() => handleEliminar(u.id, u.nickname)}
                      className="inline-flex items-center gap-xs px-md py-1 text-danger border border-danger/30 rounded-lg text-sm hover:bg-error-container transition-all">
                      <span className="material-symbols-outlined text-[16px]">delete</span>Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
