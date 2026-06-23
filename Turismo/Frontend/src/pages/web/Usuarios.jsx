import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await api.get('/usuarios/usuarios/');
        const data = res.data?.data || [];
        setUsuarios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };
    cargarUsuarios();
  }, []);

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Gestión de Usuarios</span>
      </nav>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Usuarios del Sistema</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: <span id="totalUsuarios">{loading ? '...' : usuarios.length}</span> usuarios</p>
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
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Usuario</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Correo</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Roles</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined animate-spin align-middle mr-sm">autorenew</span>Cargando...
                </td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="4" className="px-lg py-md text-center text-on-surface-variant font-body-md">No hay usuarios registrados</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[12px]">
                          {(u.nombre?.[0] || u.nickname?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-table-data text-table-data font-medium">{u.nombre ? `${u.nombre} ${u.apellido || ''}` : u.nickname}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">@{u.nickname}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-table-data text-table-data">{u.correo}</td>
                    <td className="px-lg py-md">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).map(r => (
                          <span key={r} className="px-2 py-0.5 bg-secondary-container text-secondary rounded-full font-badge text-badge">
                            {r.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <Link to={`/admin/usuarios`} className="text-primary font-label-md hover:underline">Administrar</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
