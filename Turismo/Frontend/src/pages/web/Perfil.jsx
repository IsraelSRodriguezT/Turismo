import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/httpClient';

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' });
  const [perfilId, setPerfilId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ nombre: user.nombre || '', apellido: user.apellido || '', telefono: user.telefono || '' });
      api.get('/usuarios/perfiles/').then((res) => {
        const perfiles = res.data?.data || res.data;
        if (perfiles?.length) setPerfilId(perfiles[0].id);
      }).catch(() => {});
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!perfilId) { setMsg({ type: 'error', text: 'No se encontró el perfil del usuario.' }); return; }
    setSaving(true);
    try {
      const res = await api.patch(`/usuarios/perfiles/${perfilId}/`, form);
      const updated = res.data?.data || res.data;
      const updatedUser = { ...user, nombre: updated.nombre, apellido: updated.apellido, telefono: updated.telefono };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMsg({ type: 'success', text: 'Perfil actualizado correctamente.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error al actualizar el perfil.' });
    } finally {
      setSaving(false);
    }
  };

  const initials = user ? `${(user.nombre || '')[0]}${(user.apellido || '')[0]}`.toUpperCase() || '?' : '?';

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Mi Perfil</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
            <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-md">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">{initials}</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{user?.nombre} {user?.apellido}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">{user?.correo}</p>
            <div className="inline-flex items-center gap-xs px-md py-sm bg-primary-fixed rounded-full">
              <span className="material-symbols-outlined text-primary text-[16px]">badge</span>
              <span className="font-label-md text-label-md text-primary font-semibold">{(user?.roles || ['Turista'])[0]}</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Editar Perfil</h2>
            {msg && (
              <div className={`mb-md flex items-center gap-3 px-4 py-3 rounded-xl border ${msg.type === 'error' ? 'bg-error-container text-on-error-container border-error/20' : 'bg-primary-fixed text-on-primary-fixed border-primary/20'}`}>
                <span className={`material-symbols-outlined ${msg.type === 'error' ? 'text-error' : 'text-primary'}`}>
                  {msg.type === 'error' ? 'error' : 'check_circle'}
                </span>
                <p className="font-body-md flex-1">{msg.text}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre</label>
                  <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} required
                    className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="apellido">Apellido</label>
                  <input id="apellido" name="apellido" type="text" value={form.apellido} onChange={handleChange} required
                    className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="telefono">Teléfono</label>
                <input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={handleChange}
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
              </div>
              <div className="flex gap-md">
                <button type="submit" disabled={saving}
                  className="px-xl py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-60">
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <Link to="/dashboard"
                  className="px-xl py-3 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all inline-block">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
