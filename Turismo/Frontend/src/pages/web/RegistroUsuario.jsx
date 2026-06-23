import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegistroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '', nickname: '',
    telefono: '', password: '', password_confirm: '', terms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);

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
          apellido: form.apellido,
          correo: form.correo,
          nickname: form.nickname,
          telefono: form.telefono,
          clave: form.password,
          clave_confirmacion: form.password_confirm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        if (data.errors && data.errors.details) {
          const fieldTranslations = {
            nombre: 'Nombre',
            apellido: 'Apellido',
            correo: 'Correo Electrónico',
            nickname: 'Nombre de Usuario',
            telefono: 'Teléfono',
            clave: 'Contraseña',
            clave_confirmacion: 'Confirmar Contraseña',
            non_field_errors: 'Error general'
          };
          const errList = data.errors.details.map(err => {
            const fieldName = fieldTranslations[err.field] || err.field;
            return `${fieldName}: ${err.message}`;
          });
          setMessages([{ tags: 'error', text: `Error de validación:\n- ${errList.join('\n- ')}` }]);
        } else {
          setMessages([{ tags: 'error', text: data.message || 'Error al registrar' }]);
        }
      }
    } catch {
      setMessages([{ tags: 'error', text: 'Error de conexión con el servidor' }]);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-margin-mobile md:p-margin-desktop">
      <div className="w-full max-w-[480px] bg-surface rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm">
        <div className="text-center mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary">Crear Usuario</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Registre un nuevo usuario en el sistema</p>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`mb-lg flex items-start gap-3 px-4 py-3 rounded-xl border whitespace-pre-line ${msg.tags === 'error' ? 'bg-error-container text-on-error-container border-error/20' : 'bg-primary-fixed text-on-primary-fixed border-primary/20'}`}>
            <span className="material-symbols-outlined text-error mt-0.5">error</span>
            <p className="font-body-md flex-1">{msg.text}</p>
          </div>
        ))}

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre <span className="text-danger">*</span></label>
              <input id="nombre" name="nombre" required type="text" value={form.nombre} onChange={handleChange}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="apellido">Apellido <span className="text-danger">*</span></label>
              <input id="apellido" name="apellido" required type="text" value={form.apellido} onChange={handleChange}
                className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
            </div>
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="correo">Correo Electrónico <span className="text-danger">*</span></label>
            <input id="correo" name="correo" required type="email" value={form.correo} onChange={handleChange}
              className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nickname">Nombre de Usuario <span className="text-danger">*</span></label>
            <input id="nickname" name="nickname" required type="text" value={form.nickname} onChange={handleChange}
              className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="telefono">Teléfono</label>
            <input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={handleChange}
              className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="password">Contraseña <span className="text-danger">*</span></label>
            <input id="password" name="password" required type="password" value={form.password} onChange={handleChange}
              className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="password_confirm">Confirmar Contraseña <span className="text-danger">*</span></label>
            <input id="password_confirm" name="password_confirm" required type="password" value={form.password_confirm} onChange={handleChange}
              className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest input-focus-ring transition-all" />
          </div>
          <div className="flex items-start gap-2">
            <input id="terms" name="terms" required type="checkbox" checked={form.terms} onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-focus-ring" />
            <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">Acepto los términos y condiciones</label>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50">
            {submitting ? 'Registrando...' : 'Crear Usuario'}
          </button>
          <Link to="/usuarios"
            className="w-full py-3 border border-outline-variant text-on-surface rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-all flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Volver a Usuarios
          </Link>
        </form>
        <p className="text-center mt-lg font-label-md text-label-md text-on-surface-variant">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
