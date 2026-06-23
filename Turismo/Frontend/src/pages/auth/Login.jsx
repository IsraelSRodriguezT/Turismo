import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nickname: '', password: '', remember_me: false });
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);
    setErrors({});
    setSubmitting(true);
    try {
      await login(form.nickname, form.password);
      navigate('/dashboard');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setMessages([{ tags: 'error', text: data?.message || 'Error al iniciar sesión' }]);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="login-gradient min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop">
      <main className="w-full max-w-[440px] flex flex-col items-center">
        <div className="w-full bg-surface p-lg md:p-xl rounded-xl border border-outline-variant shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="text-center mb-lg">
            <div className="flex flex-col items-center gap-sm mb-lg">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH8dadh73CI2oPsyBVauq73F42qVKchGzaRrblc_GKfhMPvaMZsdlLmzdCSiWW2SXqRJbFLftTxYpcDnH3SvPSbnJPwVEmuHIEOW73F2JvsC5gueW2PkEorA8IRbCYV-snOISTIwpx2BMOk-4T664rSboQhdkCbOO2_FwU0Xy4WylKb9e-kE5vtldY465oculd61Dx9zyywThvaH47E9KLDyUvIyy431xi1xb8czkayTbDztAtq7JDadGlMDYqPdz9E970YYoezKmK"
                  alt="Logo UNL"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h2 className="font-headline-sm text-headline-sm uppercase tracking-wider font-bold text-on-surface">Universidad Nacional de Loja</h2>
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold">Carrera de Turismo</p>
              </div>
            </div>
            <div className="space-y-sm border-b border-outline-variant pb-lg mb-lg">
              <h1 className="font-headline-lg text-headline-lg text-primary">PIT</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px] mx-auto">
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface flex items-center gap-xs" htmlFor="email">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Correo Electrónico o Usuario
                <span className="text-danger ml-xs">*</span>
              </label>
              <input
                className="w-full h-12 px-md border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest input-focus-ring transition-all placeholder:text-outline-variant"
                id="email"
                name="nickname"
                placeholder="nombre@unl.edu.ec"
                required
                type="text"
                value={form.nickname}
                onChange={handleChange}
              />
              {errors.nickname && <p className="text-danger font-body-md">{errors.nickname}</p>}
            </div>

            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface flex items-center gap-xs" htmlFor="password">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Contraseña
                <span className="text-danger ml-xs">*</span>
              </label>
              <div className="relative group">
                <input
                  className="w-full h-12 px-md border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest input-focus-ring transition-all placeholder:text-outline-variant"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
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
              {errors.password && <p className="text-danger font-body-md">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-sm">
              <input
                className="w-4 h-4 rounded border-outline text-primary-container focus:ring-focus-ring"
                id="remember"
                name="remember_me"
                type="checkbox"
                checked={form.remember_me}
                onChange={handleChange}
              />
              <label className="font-label-md text-label-md text-on-surface-variant cursor-pointer" htmlFor="remember">
                Recordar sesión en este dispositivo
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary-container text-on-primary-container font-label-md text-label-md font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
          </form>
        </div>

        <footer className="mt-xl text-center space-y-md">
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
    </div>
  );
}
