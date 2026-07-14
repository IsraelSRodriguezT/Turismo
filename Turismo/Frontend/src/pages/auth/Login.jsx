import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/httpClient';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nickname: '', password: '' });
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showRestablecer, setShowRestablecer] = useState(false);
  const [resetCorreo, setResetCorreo] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetMensaje, setResetMensaje] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nickname.trim()) newErrors.nickname = 'El nombre de usuario es obligatorio.';
    else if (form.nickname.trim().length < 3) newErrors.nickname = 'Debe tener al menos 3 caracteres.';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 6) newErrors.password = 'Debe tener al menos 6 caracteres.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRestablecer = async (e) => {
    e.preventDefault();
    setResetMensaje(null);
    if (!resetCorreo.trim()) {
      setResetMensaje({ tags: 'error', text: 'Ingresa tu correo electrónico.' });
      return;
    }
    setResetSubmitting(true);
    try {
      await api.post('/usuarios/restablecer-clave/', { correo: resetCorreo });
      setResetMensaje({ tags: 'success', text: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' });
      setResetCorreo('');
    } catch (err) {
      const msg = err?.response?.data?.correo?.[0] || err?.response?.data?.detail || 'Error al procesar la solicitud.';
      setResetMensaje({ tags: 'error', text: Array.isArray(msg) ? msg[0] : msg });
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form.nickname, form.password);
      navigate('/dashboard');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors?.details) {
        const fieldErrors = {};
        data.errors.details.forEach((d) => {
          if (d.field) fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      }
      setMessages([{ tags: 'error', text: data?.message || 'Credenciales inválidas o cuenta no encontrada.' }]);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="login-gradient min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop">
      <main className="w-full max-w-[500px] flex flex-col items-center">
        <div className="w-full bg-surface p-md rounded-xl border border-outline-variant shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="text-center mb-md">
            <div className="flex flex-col items-center gap-xs mb-xs">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH8dadh73CI2oPsyBVauq73F42qVKchGzaRrblc_GKfhMPvaMZsdlLmzdCSiWW2SXqRJbFLftTxYpcDnH3SvPSbnJPwVEmuHIEOW73F2JvsC5gueW2PkEorA8IRbCYV-snOISTIwpx2BMOk-4T664rSboQhdkCbOO2_FwU0Xy4WylKb9e-kE5vtldY465oculd61Dx9zyywThvaH47E9KLDyUvIyy431xi1xb8czkayTbDztAtq7JDadGlMDYqPdz9E970YYoezKmK"
                  alt="Logo UNL"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h2 className="font-title-lg text-title-lg uppercase tracking-wider font-bold text-on-surface">Universidad Nacional de Loja</h2>
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold">Carrera de Turismo</p>
              </div>
            </div>
            <div className="space-y-xs border-b border-outline-variant pb-md mb-md">
              <h1 className="font-headline-md text-headline-md font-black text-primary">PIT</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[320px] mx-auto">
                Plataforma Interactiva de Turismo: Acceda al sistema de administración y análisis de datos.
              </p>
            </div>
          </div>

          {messages.map((msg, i) => (
            <div key={i} className={`mb-md flex items-center gap-3 px-4 py-3 rounded-xl border ${msg.tags === 'error' ? 'bg-error-container text-on-error-container border-error/20' : 'bg-primary-fixed text-on-primary-fixed border-primary/20'}`}>
              <span className={`material-symbols-outlined ${msg.tags === 'error' ? 'text-error' : 'text-primary'}`}>
                {msg.tags === 'error' ? 'error' : 'check_circle'}
              </span>
              <p className="font-body-md flex-1">{msg.text}</p>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface flex items-center gap-xs" htmlFor="email">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Nombre de usuario
                <span className="text-danger ml-xs">*</span>
              </label>
              <input
                className="w-full h-10 px-md border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest input-focus-ring transition-all placeholder:text-outline-variant"
                id="email"
                name="nickname"
                placeholder="Ingrese su usuario"
                required
                maxLength={100}
                type="text"
                value={form.nickname}
                onChange={handleChange}
              />
              {errors.nickname && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.nickname}</p>}
            </div>

            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface flex items-center gap-xs" htmlFor="password">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Contraseña
                  <span className="text-danger ml-xs">*</span>
                </label>
                <button type="button" onClick={() => setShowRestablecer(true)}
                  className="font-label-sm text-label-sm text-primary hover:underline transition-all">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative group">
                <input
                  className="w-full h-10 px-md border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest input-focus-ring transition-all placeholder:text-outline-variant"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  maxLength={128}
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 bg-primary-container text-on-primary-container font-label-md text-label-md font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                  Verificando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
            <a href="/" className="w-full h-10 border border-outline-variant text-on-surface-variant font-label-md text-label-md font-bold rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">home</span>
              Volver al inicio
            </a>
          </form>
        </div>

        <footer className="mt-lg text-center space-y-md">
          <div className="flex items-center justify-center gap-md">
            <div className="flex items-center gap-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="font-label-sm text-label-sm">Conexión Segura</span>
            </div>
            <div className="w-[1px] h-4 bg-outline-variant"></div>
            <div className="flex items-center gap-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span className="font-label-sm text-label-sm">© 2026 UNL - Todos los derechos reservados</span>
            </div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            ¿No tienes cuenta? <Link to="/register" className="text-primary font-bold hover:underline">Regístrate aquí</Link>
          </p>
        </footer>
      </main>

      {/* Modal restablecer contraseña */}
      {showRestablecer && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-margin-mobile" onClick={() => setShowRestablecer(false)}>
          <div className="w-full max-w-[420px] bg-surface rounded-xl border border-outline-variant shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-lg border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Restablecer Contraseña</h2>
              <button onClick={() => { setShowRestablecer(false); setResetMensaje(null); setResetCorreo(''); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleRestablecer} className="p-lg space-y-md">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
              {resetMensaje && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${resetMensaje.tags === 'error' ? 'bg-error-container text-on-error-container border-error/20' : 'bg-primary-fixed text-on-primary-fixed border-primary/20'}`}>
                  <span className={`material-symbols-outlined ${resetMensaje.tags === 'error' ? 'text-error' : 'text-primary'}`}>
                    {resetMensaje.tags === 'error' ? 'error' : 'check_circle'}
                  </span>
                  <p className="font-body-md flex-1">{resetMensaje.text}</p>
                </div>
              )}
              <div className="space-y-sm">
                <label className="font-label-md text-label-md text-on-surface flex items-center gap-xs" htmlFor="resetCorreo">
                  <span className="material-symbols-outlined text-[18px]">email</span>
                  Correo Electrónico
                </label>
                <input
                  className="w-full h-10 px-md border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest input-focus-ring transition-all placeholder:text-outline-variant"
                  id="resetCorreo"
                  type="email"
                  placeholder="nombre@unl.edu.ec"
                  value={resetCorreo}
                  onChange={e => setResetCorreo(e.target.value)}
                />
              </div>
              <button type="submit" disabled={resetSubmitting}
                className="w-full h-10 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {resetSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    Enviar Instrucciones
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
