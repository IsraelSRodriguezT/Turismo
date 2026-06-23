import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '', correo: '', telefono: '', pais: '',
    nickname: '', password: '', password_confirm: '', terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);
    if (form.password !== form.password_confirm) {
      setMessages([{ tags: 'error', text: 'Las contraseñas no coinciden' }]);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/usuarios/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          telefono: form.telefono,
          pais_procedencia: form.pais,
          nickname: form.nickname,
          clave: form.password,
          clave_confirmacion: form.password_confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages([{ tags: 'error', text: data.message || 'Error al registrarse' }]);
        setSubmitting(false);
        return;
      }
      window.location.href = '/login?registered=1';
    } catch {
      setMessages([{ tags: 'error', text: 'Error de conexión con el servidor' }]);
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-stretch bg-background text-on-background font-body-md overflow-x-hidden">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary overflow-hidden relative items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-60 mix-blend-multiply"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXimKDFI68nDEPFzREnqVIxUsi1nRAvn03HfrVk18_2ah22_Y4iAzfdQg&s=10"
            alt="A cinematic aerial view of Loja, Ecuador"
            loading="lazy"
          />
        </div>
        <div className="relative z-10 p-margin-desktop text-white max-w-lg text-center md:text-left">
          <h1 className="font-display-lg text-display-lg mb-base">PIT Loja</h1>
          <p className="font-body-lg text-body-lg mb-gutter opacity-90">Plataforma Interactiva de Turismo. Uniendo la investigación académica con el descubrimiento del viajero.</p>
          <div className="grid grid-cols-2 gap-gutter text-left">
            <div className="p-base bg-white/10 backdrop-blur-md rounded-lg">
              <span className="material-symbols-outlined mb-2 text-secondary-container">insights</span>
              <h3 className="font-headline-md text-headline-md block text-sm">Investigación</h3>
              <p className="font-body-sm text-body-sm opacity-80">Datos precisos para el desarrollo sostenible.</p>
            </div>
            <div className="p-base bg-white/10 backdrop-blur-md rounded-lg">
              <span className="material-symbols-outlined mb-2 text-secondary-container">explore</span>
              <h3 className="font-headline-md text-headline-md block text-sm">Exploración</h3>
              <p className="font-body-sm text-body-sm opacity-80">Experiencias auténticas en Loja.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="w-full max-w-[480px]">
          <header className="mb-gutter text-center md:text-left">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Crear una cuenta</h2>
            <p className="font-body-md text-on-surface-variant">Únete a la comunidad de investigadores y turistas de Loja.</p>
          </header>

          {messages.map((msg, i) => (
            <div key={i} className="rounded-xl p-4 border border-outline-variant bg-surface-container-lowest text-on-surface mb-6">
              {msg.text}
            </div>
          ))}

          <form className="space-y-gutter" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="nombre">Nombre Completo <span className="text-status-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                  <input id="nombre" name="nombre" required type="text" placeholder="Ej. Juan Pérez" value={form.nombre} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all" />
                </div>
              </div>
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="correo">Correo Electrónico <span className="text-status-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                  <input id="correo" name="correo" required type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="telefono">Teléfono</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">call</span>
                  <input id="telefono" name="telefono" type="tel" placeholder="+593 ..." value={form.telefono} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all" />
                </div>
              </div>
              <div className="group">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="pais">País de Procedencia <span className="text-status-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">public</span>
                  <select id="pais" name="pais" required value={form.pais} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all appearance-none">
                    <option disabled value="">Selecciona tu país</option>
                    <option value="EC">Ecuador</option>
                    <option value="CO">Colombia</option>
                    <option value="PE">Perú</option>
                    <option value="ES">España</option>
                    <option value="US">Estados Unidos</option>
                    <option value="Other">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="nickname">Usuario <span className="text-status-error">*</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                <input id="nickname" name="nickname" required type="text" placeholder="tu_usuario" value={form.nickname} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all" />
              </div>
            </div>

            <div className="group">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="password">Contraseña <span className="text-status-error">*</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                <input id="password" name="password" required type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <p className="text-[10px] mt-1 text-on-surface-variant">Debe contener al menos 8 caracteres, incluyendo una mayúscula y un número.</p>
            </div>

            <div className="group">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 ml-1" htmlFor="password_confirm">Confirmar Contraseña <span className="text-status-error">*</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">lock_check</span>
                <input id="password_confirm" name="password_confirm" required type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={form.password_confirm} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary form-input-focus outline-none transition-all" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
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
                {submitting ? 'Registrando...' : 'Registrarse ahora'}
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
