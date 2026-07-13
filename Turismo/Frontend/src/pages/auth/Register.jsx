import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/httpClient';

const VALIDACIONES = {
  nombre: { required: true, maxLength: 50, message: 'El nombre es obligatorio (máx. 50 caracteres).' },
  apellido: { required: true, maxLength: 50, message: 'El apellido es obligatorio (máx. 50 caracteres).' },
  correo: { required: true, maxLength: 100, message: 'El correo electrónico es obligatorio.' },
  nickname: { required: true, maxLength: 25, message: 'El usuario es obligatorio (máx. 25 caracteres).' },
  telefono: { required: false, maxLength: 10, message: 'El teléfono debe tener 10 dígitos.' },
  password: { required: true, minLength: 8, maxLength: 16, message: 'La contraseña debe tener entre 8 y 16 caracteres.' },
  password_confirm: { required: true, message: 'Debes confirmar la contraseña.' },
};

export default function Register() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '', telefono: '',
    nickname: '', password: '', password_confirm: '', terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validarCampo = (name, value, allValues) => {
    if (!value && !allValues[name]) return null;
    const rules = VALIDACIONES[name];
    if (!rules) return null;
    const val = String(value || '').trim();
    if (rules.required && !val) return rules.message;
    if (rules.maxLength && val.length > rules.maxLength) return rules.message;
    if (rules.minLength && val.length < rules.minLength) return rules.message;
    if (name === 'correo' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Ingresa un correo electrónico válido.';
    if (name === 'correo' && val.length > 100) return 'El correo no puede exceder 100 caracteres.';
    if (name === 'telefono' && val && (!/^\d+$/.test(val) || val.length !== 10)) return 'El teléfono debe contener exactamente 10 dígitos numéricos.';
    if (name === 'password' && val.length > 16) return 'La contraseña no puede exceder 16 caracteres.';
    if (name === 'password_confirm' && allValues.password !== val) return 'Las contraseñas no coinciden.';
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      return next;
    });
    setTimeout(() => {
      const err = validarCampo(name, value, { ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: err }));
    }, 0);
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(VALIDACIONES).forEach(([campo, rules]) => {
      const val = (form[campo] || '').trim();
      if (rules.required && !val) {
        newErrors[campo] = rules.message;
      } else if (rules.maxLength && val.length > rules.maxLength) {
        newErrors[campo] = rules.message;
      } else if (rules.minLength && val.length < rules.minLength) {
        newErrors[campo] = rules.message;
      }
    });
    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido.';
    }
    if (form.correo && form.correo.length > 100) {
      newErrors.correo = 'El correo no puede exceder 100 caracteres.';
    }
    if (form.telefono && (!/^\d+$/.test(form.telefono) || form.telefono.length !== 10)) {
      newErrors.telefono = 'El teléfono debe contener exactamente 10 dígitos numéricos.';
    }
    if (form.password && form.password.length > 16) {
      newErrors.password = 'La contraseña no puede exceder 16 caracteres.';
    }
    if (form.password && form.password_confirm && form.password !== form.password_confirm) {
      newErrors.password_confirm = 'Las contraseñas no coinciden.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);
    if (!form.terms) {
      setMessages([{ tags: 'error', text: 'Debes aceptar los Términos de Servicio y Política de Privacidad.' }]);
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post('/usuarios/registro/', {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        nickname: form.nickname.trim(),
        clave: form.password,
        clave_confirmacion: form.password_confirm,
      });
      navigate('/login?registered=1');
    } catch (err) {
      const data = err?.response?.data;
      let hasFieldErrors = false;
      let hasGlobalMsg = false;
      if (data?.errors?.details) {
        const fieldErrors = {};
        data.errors.details.forEach((d) => {
          if (d.field) fieldErrors[d.field] = d.message;
        });
        if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); hasFieldErrors = true; }
      }
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const fieldErrors = {};
        let globalMsg = null;
        Object.entries(data).forEach(([key, val]) => {
          if (Array.isArray(val)) {
            if (['nickname', 'correo', 'nombre', 'apellido', 'telefono', 'clave', 'clave_confirmacion'].includes(key)) {
              fieldErrors[key] = val[0];
            } else {
              globalMsg = val[0];
            }
          }
        });
        if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); hasFieldErrors = true; }
        if (globalMsg) { setMessages([{ tags: 'error', text: globalMsg }]); hasGlobalMsg = true; }
      }
      if (!hasFieldErrors && !hasGlobalMsg) {
        setMessages([{ tags: 'error', text: 'Error al registrarse. Verifica los datos e intenta de nuevo.' }]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-stretch bg-background text-on-background font-body-md overflow-x-hidden">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gray-950 overflow-hidden relative items-center justify-center">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-55"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXimKDFI68nDEPFzREnqVIxUsi1nRAvn03HfrVk18_2ah22_Y4iAzfdQg&s=10"
            alt="Loja, Ecuador"
            loading="lazy"
          />
        </div>
        <div className="relative z-10 p-margin-desktop max-w-lg text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg mb-base">PIT Loja</h1>
          <p className="text-lg font-medium text-white/90 leading-relaxed drop-shadow">Plataforma Interactiva de Turismo. Uniendo la investigación académica con el descubrimiento del viajero.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="w-full max-w-[480px]">
          <header className="mb-gutter text-center md:text-left">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Crear una cuenta</h2>
            <p className="font-body-md text-on-surface-variant">Únete a la comunidad de investigadores y turistas de Loja.</p>
          </header>

          {messages.map((msg, i) => (
            <div key={i} className={`mb-md flex items-center gap-3 px-4 py-3 rounded-xl border ${msg.tags === 'error' ? 'bg-error-container text-on-error-container border-error/20' : 'bg-primary-fixed text-on-primary-fixed border-primary/20'}`}>
              <span className={`material-symbols-outlined ${msg.tags === 'error' ? 'text-error' : 'text-primary'}`}>
                {msg.tags === 'error' ? 'error' : 'check_circle'}
              </span>
              <p className="font-body-md flex-1">{msg.text}</p>
            </div>
          ))}

          <form className="space-y-gutter" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="nombre">Nombre <span className="text-status-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                  <input id="nombre" name="nombre" required type="text" placeholder="Ej. Juan" value={form.nombre} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
                {errors.nombre && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.nombre}</p>}
              </div>
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="apellido">Apellido <span className="text-status-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">badge</span>
                  <input id="apellido" name="apellido" required type="text" placeholder="Ej. Pérez" value={form.apellido} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
                {errors.apellido && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.apellido}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="correo">Correo Electrónico <span className="text-status-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                  <input id="correo" name="correo" required type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
                {errors.correo && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.correo}</p>}
              </div>
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="telefono">Teléfono</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">call</span>
                  <input id="telefono" name="telefono" type="text" inputMode="numeric" placeholder="0999999999" maxLength={10} value={form.telefono} onChange={e => {
                    const soloDigitos = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setForm(prev => ({ ...prev, telefono: soloDigitos }));
                    if (errors.telefono) setErrors(prev => ({ ...prev, telefono: null }));
                  }}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
                {errors.telefono && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.telefono}</p>}
              </div>
            </div>

            <div className="group">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="nickname">Usuario <span className="text-status-error">*</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">account_circle</span>
                <input id="nickname" name="nickname" required type="text" placeholder="tu_usuario" value={form.nickname} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              {errors.nickname && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.nickname}</p>}
            </div>

            <div className="group">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="password">Contraseña <span className="text-status-error">*</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                <input id="password" name="password" required type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.password}</p>}
              <p className="text-[10px] mt-1 text-on-surface-variant">Debe contener entre 8 y 16 caracteres.</p>
            </div>

            <div className="group">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="password_confirm">Confirmar Contraseña <span className="text-status-error">*</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                <input id="password_confirm" name="password_confirm" required type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={form.password_confirm} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password_confirm && <p className="flex items-center gap-xs text-danger font-body-md mt-1"><span className="material-symbols-outlined text-[16px]">error</span>{errors.password_confirm}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" name="terms" required type="checkbox" checked={form.terms} onChange={handleChange}
                className="mt-1 w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary" />
              <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                Acepto los <a className="text-primary font-semibold hover:underline" href="#">Términos de Servicio</a> y la <a className="text-primary font-semibold hover:underline" href="#">Política de Privacidad</a> de PIT Loja.
              </label>
            </div>

            <div className="space-y-4 pt-4">
              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50">
                {submitting ? (
                  <span className="flex items-center justify-center gap-sm">
                    <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                    Registrando...
                  </span>
                ) : 'Registrarse ahora'}
              </button>
              <div className="relative py-2 flex items-center">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink mx-4 text-on-surface-variant font-label-md text-label-md">O</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>
              <Link to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-variant/50 transition-all">
                <span className="material-symbols-outlined">arrow_back</span>
                Volver al inicio
              </Link>
            </div>
          </form>

          <footer className="mt-margin-desktop text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              ¿Necesitas ayuda? <a className="text-secondary font-semibold hover:underline" href="#">Contactar a soporte</a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
