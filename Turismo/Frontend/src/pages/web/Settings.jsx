import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pit-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(stored === 'true' || (!stored && prefersDark));
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newDark = html.classList.toggle('dark');
    localStorage.setItem('pit-dark-mode', newDark);
    setIsDark(newDark);
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Configuración</span>
      </nav>
      <div className="max-w-2xl">
        <div className="bg-surface rounded-xl border border-outline-variant p-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Preferencias del Sistema</h2>
          <div className="space-y-lg">
            <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">Notificaciones por correo</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Recibir actualizaciones del sistema</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-focus-ring transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">Modo oscuro</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Alternar tema del sistema</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isDark} onChange={toggleDarkMode} />
                <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-focus-ring transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
