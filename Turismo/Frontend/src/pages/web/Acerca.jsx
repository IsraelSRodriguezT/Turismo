import React from 'react';
import { Link } from 'react-router-dom';

export default function Acerca() {
  return (
    <div className="pit-app-shell bg-background text-on-surface transition-colors duration-200 antialiased min-h-screen">
      <header className="w-full border-b border-outline-variant bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="flex items-center justify-between px-margin-desktop py-md max-w-[1440px] mx-auto">
          <div className="flex items-center gap-xl">
            <Link className="font-headline-sm text-headline-sm font-bold text-primary" to="/">PIT UNL</Link>
            <div className="hidden md:flex items-center gap-lg">
              <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" to="/">Inicio</Link>
              <Link className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1" to="/acerca">Acerca</Link>
            </div>
          </div>
          <Link to="/login" className="font-label-md text-label-md text-primary font-semibold hover:underline">Iniciar Sesión</Link>
        </nav>
      </header>

      <section className="hero-about bg-primary text-white py-xl">
        <div className="px-margin-desktop max-w-[1440px] mx-auto text-center">
          <h1 className="font-display-lg text-display-lg mb-md">Acerca de PIT</h1>
          <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90">Plataforma Interactiva de Turismo — un proyecto académico de la Universidad Nacional de Loja para la gestión sostenible del turismo.</p>
        </div>
      </section>

      <section className="py-xl px-margin-desktop max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-md">Nuestra Misión</h2>
            <p className="font-body-lg text-body-lg text-secondary mb-lg">Centralizar, estandarizar y poner a disposición de investigadores, gestores y turistas la información territorial estratégica de la provincia de Loja, mediante una plataforma tecnológica de vanguardia.</p>
            <ul className="space-y-md">
              <li className="flex items-start gap-md"><span className="material-symbols-outlined text-primary">check_circle</span><span className="font-body-md text-body-md text-on-background">Investigación académica de calidad.</span></li>
              <li className="flex items-start gap-md"><span className="material-symbols-outlined text-primary">check_circle</span><span className="font-body-md text-body-md text-on-background">Promoción del turismo sostenible.</span></li>
              <li className="flex items-start gap-md"><span className="material-symbols-outlined text-primary">check_circle</span><span className="font-body-md text-body-md text-on-background">Tecnología al servicio del territorio.</span></li>
            </ul>
          </div>
          <div className="bg-surface-container-low rounded-xl p-xl border border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Contacto</h3>
            <div className="space-y-md">
              <div className="flex items-center gap-md"><span className="material-symbols-outlined text-primary">location_on</span><span className="font-body-md text-body-md text-on-surface-variant">Universidad Nacional de Loja, Loja, Ecuador</span></div>
              <div className="flex items-center gap-md"><span className="material-symbols-outlined text-primary">mail</span><span className="font-body-md text-body-md text-on-surface-variant">turismo@unl.edu.ec</span></div>
              <div className="flex items-center gap-md"><span className="material-symbols-outlined text-primary">phone</span><span className="font-body-md text-body-md text-on-surface-variant">+593 7 2547-200</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
