import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

const rolesOptions = [
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'GESTOR_TERRITORIAL', label: 'Gestor Territorial' },
  { value: 'GESTOR_TURISTICO', label: 'Gestor Turístico' },
  { value: 'INVESTIGADOR', label: 'Investigador' },
  { value: 'TURISTA', label: 'Turista' },
];

const generarClave = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let clave = '';
  for (let i = 0; i < 8; i++) {
    clave += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return clave;
};

export default function Usuarios() {
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [claveGenerada, setClaveGenerada] = useState(null);

  const [nickname, setNickname] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [roles, setRoles] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const [errores, setErrores] = useState({});
  const [errorEmail, setErrorEmail] = useState('');

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

  useEffect(() => { cargarUsuarios(); }, []);

  const openModal = (usuario = null) => {
    setModalError(null);
    setClaveGenerada(null);

    if (usuario) {
      setEditando(usuario.id);
      setNickname(usuario.nickname || '');
      setNombre(usuario.nombre || '');
      setApellido(usuario.apellido || '');
      setCorreo(usuario.correo || '');
      setTelefono(usuario.telefono || '');
      setRoles(usuario.roles || []);
      setIsActive(usuario.is_active !== false);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditando(null);
    setNickname('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setRoles([]);
    setIsActive(true);
    setErrores({});
    setErrorEmail('');
    setClaveGenerada(null);
    setModalError(null);
  };

  const cerrarModal = () => {
    setShowModal(false);
    resetForm();
  };

  const toggleRol = (valor) => {
    setRoles(prev =>
      prev.includes(valor) ? prev.filter(r => r !== valor) : [...prev, valor]
    );
    limpiarError('roles');
  };

  const limpiarError = (campo) => {
    setErrores(prev => ({ ...prev, [campo]: undefined }));
  };

  const validarFormulario = () => {
    const e = {};
    if (!nickname.trim()) e.nickname = 'El nickname es obligatorio.';
    else if (nickname.length > 150) e.nickname = 'Máximo 150 caracteres.';
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    else if (nombre.length > 120) e.nombre = 'Máximo 120 caracteres.';
    if (!apellido.trim()) e.apellido = 'El apellido es obligatorio.';
    else if (apellido.length > 120) e.apellido = 'Máximo 120 caracteres.';
    if (!correo.trim()) e.correo = 'El correo es obligatorio.';
    else if (correo.length > 254) e.correo = 'Máximo 254 caracteres.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = 'Formato de correo inválido.';
    if (!roles.length) e.roles = 'Debe seleccionar al menos un rol.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setSubmitting(true);
    setModalError(null);
    setClaveGenerada(null);
    try {
      const payload = {
        nickname: nickname.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.trim(),
        telefono,
        roles,
        is_active: isActive,
      };

      if (editando) {
        await api.put(`/usuarios/usuarios-admin/${editando}/`, payload);
      } else {
        const clave = generarClave();
        payload.clave = clave;
        await api.post('/usuarios/usuarios-admin/', payload);
        setClaveGenerada(clave);
      }

      if (!editando) {
        setNickname(''); setNombre(''); setApellido('');
        setCorreo(''); setTelefono(''); setRoles([]);
        setIsActive(true);
        setErrores({});
        setErrorEmail('');
      } else {
        cerrarModal();
      }
      cargarUsuarios();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.non_field_errors?.[0] || 'Error al guardar el usuario.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, nicknameU) => {
    if (!confirm(`¿Eliminar el usuario "${nicknameU}"?`)) return;
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
        <span className="font-bold text-on-surface">Gestión de Usuarios</span>
      </nav>

      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Usuarios del Sistema</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total: {loading ? '...' : usuarios.length} usuarios</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">
          <span className="material-symbols-outlined">person_add</span>Agregar Usuario
        </button>
      </div>

      {loading ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md animate-spin">autorenew</span>
          <p className="font-body-lg text-body-lg">Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className="text-center py-xl text-danger">
          <span className="material-symbols-outlined text-[48px] block mb-md">error</span>
          <p className="font-body-lg text-body-lg">{error}</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-md">group_off</span>
          <p className="font-body-lg text-body-lg">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low sticky top-0">
                <tr>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Usuario</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Correo</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Teléfono</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Roles</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Activo</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[12px]">
                          {(u.nombre?.[0] || u.nickname?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-table-data text-table-data font-medium">{u.nombre} {u.apellido}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">@{u.nickname}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-table-data text-table-data">{u.correo}</td>
                    <td className="px-lg py-md font-table-data text-table-data text-on-surface-variant">{u.telefono || '—'}</td>
                    <td className="px-lg py-md">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).map(r => {
                          const opt = rolesOptions.find(o => o.value === r);
                          return (
                            <span key={r} className="px-2 py-0.5 bg-secondary-container text-secondary rounded-full font-badge text-badge whitespace-nowrap">
                              {opt?.label || r.replace(/_/g, ' ')}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active !== false ? 'bg-success-container text-success' : 'bg-error-container text-danger'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active !== false ? 'bg-success' : 'bg-danger'}`} />
                        {u.is_active !== false ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openModal(u)}
                          className="inline-flex items-center justify-center w-9 h-9 text-primary rounded-lg hover:bg-primary-fixed transition-all"
                          title="Editar">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleEliminar(u.id, u.nickname)}
                          className="inline-flex items-center justify-center w-9 h-9 text-danger rounded-lg hover:bg-error-container transition-all"
                          title="Eliminar">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 overflow-y-auto py-4">
          <div className="w-full max-w-xl mx-4 bg-surface rounded-xl border border-outline-variant shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={cerrarModal}
                className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-lg space-y-md">
              {modalError && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-error-container text-on-error-container border-error/20">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="font-body-md flex-1">{modalError}</p>
                </div>
              )}

              {claveGenerada && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-success-container text-on-success-container border-success/20">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <div className="flex-1">
                    <p className="font-body-md font-bold">Usuario creado exitosamente</p>
                    <p className="font-body-sm">Contraseña generada: <span className="font-mono font-bold">{claveGenerada}</span></p>
                    <p className="font-body-sm text-on-surface-variant">Comparte esta contraseña con el usuario.</p>
                  </div>
                  <button type="button" onClick={cerrarModal}
                    className="p-1 rounded-lg hover:bg-black/10 text-on-surface-variant">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              )}

              {!claveGenerada && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalNickname">Nickname <span className="text-danger">*</span></label>
                      <input id="modalNickname" type="text" value={nickname} maxLength={150} autoFocus
                        onChange={(e) => { setNickname(e.target.value); limpiarError('nickname'); }}
                        placeholder="ej: juan_perez"
                        className={`w-full h-11 px-md border ${errores.nickname ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                      {errores.nickname && <p className="text-danger text-sm mt-1">{errores.nickname}</p>}
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalCorreo">Correo <span className="text-danger">*</span></label>
                      <input id="modalCorreo" type="email" value={correo} maxLength={254}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCorreo(val);
                          limpiarError('correo');
                          setErrorEmail(val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Formato de correo inválido' : '');
                        }}
                        placeholder="ej: juan@correo.com"
                        className={`w-full h-11 px-md border ${errores.correo || errorEmail ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                      {(errores.correo || errorEmail) && <p className="text-danger text-sm mt-1">{errores.correo || errorEmail}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalNombre">Nombre <span className="text-danger">*</span></label>
                      <input id="modalNombre" type="text" value={nombre} maxLength={120}
                        onChange={(e) => { setNombre(e.target.value); limpiarError('nombre'); }}
                        placeholder="Ej. Juan"
                        className={`w-full h-11 px-md border ${errores.nombre ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                      {errores.nombre && <p className="text-danger text-sm mt-1">{errores.nombre}</p>}
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalApellido">Apellido <span className="text-danger">*</span></label>
                      <input id="modalApellido" type="text" value={apellido} maxLength={120}
                        onChange={(e) => { setApellido(e.target.value); limpiarError('apellido'); }}
                        placeholder="Ej. Pérez"
                        className={`w-full h-11 px-md border ${errores.apellido ? 'border-danger' : 'border-outline'} rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all`} />
                      {errores.apellido && <p className="text-danger text-sm mt-1">{errores.apellido}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="modalTelefono">Teléfono</label>
                      <input id="modalTelefono" type="text" value={telefono} maxLength={10}
                        onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="0987654321"
                        className="w-full h-11 px-md border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-xs text-sm text-on-surface cursor-pointer">
                        <input type="checkbox" checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="accent-primary w-4 h-4" />
                        Usuario activo
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Roles <span className="text-danger">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                      {rolesOptions.map(r => (
                        <label key={r.value} className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-colors ${roles.includes(r.value) ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-outline'}`}>
                          <input type="checkbox" checked={roles.includes(r.value)}
                            onChange={() => toggleRol(r.value)}
                            className="accent-primary w-4 h-4" />
                          <span className="font-label-md text-label-md text-on-surface">{r.label}</span>
                        </label>
                      ))}
                    </div>
                    {errores.roles && <p className="text-danger text-sm mt-1">{errores.roles}</p>}
                  </div>
                </>
              )}

              {!claveGenerada && (
                <div className="flex justify-between gap-md pt-md border-t border-outline-variant">
                  <button type="button" onClick={cerrarModal}
                    className="px-xl h-10 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={submitting}
                    className="px-xl h-10 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-60">
                    {submitting ? 'Guardando...' : (editando ? 'Actualizar Usuario' : 'Guardar Usuario')}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
