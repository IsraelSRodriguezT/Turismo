import React from 'react';
import { Link } from 'react-router-dom';

export default function FooterPublic() {
  return (
    <footer className="bg-surface border-t border-outline-variant px-margin-desktop py-lg">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-md">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[16px]">account_balance</span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-primary">PIT UNL</span>
        </div>
        <div className="flex items-center gap-lg">
          <Link to="/acerca" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Acerca</Link>
          <Link to="/explorador" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Explorador</Link>
          <Link to="/reportes" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Estadísticas</Link>
          <Link to="/investigacion" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Investigación</Link>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © 2026 Universidad Nacional de Loja
        </p>
      </div>
    </footer>
  );
}
