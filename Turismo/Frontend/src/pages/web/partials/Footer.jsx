import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant px-margin-desktop py-lg">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-sm">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © 2026 Universidad Nacional de Loja — Carrera de Turismo. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-lg">
          <Link to="/acerca" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Acerca de</Link>
          <Link to="/explorador" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Explorador</Link>
          <Link to="/reportes" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Reportes</Link>
        </div>
      </div>
    </footer>
  );
}
