import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FooterPublic from './partials/FooterPublic';

export default function Home({ totalCantones = 16, totalInvestigaciones = 450, usuariosActivos = '2.4k', coberturaProvincial = 85 }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant shadow-sm">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[1440px] mx-auto">
          <Link className="font-headline-sm text-headline-sm font-bold text-primary" to="/">PIT UNL</Link>
          <div className="flex items-center gap-sm md:gap-md">
            {user ? (
              <Link to="/dashboard" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">account_circle</span>{user.nickname || user.nombre || user.email}
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex px-md py-sm font-label-md text-label-md border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-all">Iniciar Sesión</Link>
                <Link to="/register" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container">Registrarse</Link>
              </>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container transition-colors" aria-label="Abrir menú">
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant px-margin-desktop py-sm">
            <div className="pt-sm border-t border-outline-variant flex gap-sm">
              {user ? (
                <Link to="/dashboard" className="flex-1 text-center px-md py-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors">{user.nickname || user.nombre || user.email}</Link>
              ) : (
                <>
                  <Link to="/login" className="flex-1 text-center px-md py-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">Iniciar Sesión</Link>
                  <Link to="/register" className="flex-1 text-center px-md py-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main>
        <section className="relative w-full min-h-[400px] md:min-h-[600px] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://www.cooperativaloja.com/imagenes/ciudad-de-loja.jpg')" }}>
          <div className="absolute inset-0 hero-gradient" />
          <div className="relative z-10 px-margin-desktop max-w-4xl py-14 md:py-20">
            <span className="inline-flex items-center gap-xs bg-white/10 backdrop-blur-sm border border-white/25 text-white px-md py-xs rounded-full text-[12px] tracking-wider uppercase mb-md">
              <span className="material-symbols-outlined text-[15px]">travel_explore</span>Territorio inteligente
            </span>
            <h1 className="font-headline-lg text-headline-lg text-white mb-md max-w-2xl">Descubre y fortalece el turismo en Loja</h1>
            <p className="font-body-lg text-body-lg text-white/90 mb-xl max-w-xl">Plataforma Interactiva de Turismo: centralizamos información territorial estratégica para potenciar la promoción, investigación y gestión sostenible del destino Loja.</p>
            <div className="flex flex-wrap gap-md">
              <Link to="/explorador" className="bg-primary text-on-primary px-xl py-md rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all flex items-center gap-xs">
                <span className="material-symbols-outlined">map</span>Explorar Mapa
              </Link>
              <a href="#acerca" onClick={(e) => { e.preventDefault(); document.getElementById('acerca')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white/10 backdrop-blur-md border border-white/35 text-white px-xl py-md rounded-lg font-label-md text-label-md hover:bg-white/20">Saber más</a>
            </div>
          </div>
        </section>
        <section className="bg-surface py-xl border-b border-outline-variant">
          <div className="px-margin-desktop max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-headline-md text-headline-md text-primary">{totalCantones}</div>
              <div className="font-label-md text-label-md text-secondary">Cantones</div>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-headline-md text-headline-md text-primary">{totalInvestigaciones}+</div>
              <div className="font-label-md text-label-md text-secondary">Investigaciones</div>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-headline-md text-headline-md text-primary">{usuariosActivos}</div>
              <div className="font-label-md text-label-md text-secondary">Usuarios activos</div>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-headline-md text-headline-md text-primary">{coberturaProvincial}%</div>
              <div className="font-label-md text-label-md text-secondary">Cobertura provincial</div>
            </div>
          </div>
        </section>
        <section className="py-xl px-margin-desktop max-w-[1440px] mx-auto">
          <div className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-xs">Información al servicio del territorio</h2>
            <div className="h-1 w-16 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="bg-surface p-xl rounded-xl border border-technical hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined">explore</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Mapa interactivo</h3>
              <p className="font-body-md text-body-md text-secondary">Explora sitios turísticos, servicios y rutas con capas técnicas diseñadas para un análisis geográfico detallado.</p>
            </div>
            <div className="bg-surface p-xl rounded-xl border border-technical hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Inventario digital</h3>
              <p className="font-body-md text-body-md text-secondary">Accede a fichas técnicas estandarizadas de cada sitio, con datos integrales para promoción y planificación.</p>
            </div>
            <div className="bg-surface p-xl rounded-xl border border-technical hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Investigación académica</h3>
              <p className="font-body-md text-body-md text-secondary">Datos crudos y procesados para proyectos de tesis y toma de decisiones, curados por la excelencia académica de la UNL.</p>
            </div>
          </div>
        </section>
        <section className="py-xl bg-surface-container-low border-y border-outline-variant">
          <div className="px-margin-desktop max-w-[1440px] mx-auto flex flex-col md:flex-row gap-xl items-center">
            <div className="w-full md:w-1/2">
              <div className="rounded-xl overflow-hidden border border-outline-variant">
                <img alt="UNL Campus" className="w-full h-auto object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR_ahs19GTXuUYKNZ5vIGqIOJCSlOyjUxheP4vWGD4-GBoGz08IZVRPi0UiY7-ACov2EsYbXnBwsz0c9msPGmdThJCWSMe5j6Ijq_1d3eY-IDeNX3o1fp_cTO8hDitEFDAjPSPcG5lZtRxJUTmQQfBxdaW-0oc1dQ126MUQ5K13makhx3ApJ4jAJLo--c6hydOGiIfU8fTKclTRnIcdKDdrZ5LT36DKnz2FT9JwKSOvpq0MNM-HxO3T_XwmXYaqAjTOVjskKne6FCP" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-xs block">Excelencia académica</span>
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-md">Un proyecto de la Universidad Nacional de Loja</h2>
              <p className="font-body-lg text-body-lg text-secondary mb-lg">Colaboración activa entre la Facultad de la Energía, las Industrias y los Recursos Naturales No Renovables y las comunidades locales para el desarrollo sostenible.</p>
              <ul className="space-y-md">
                <li className="flex items-start gap-md"><span className="material-symbols-outlined text-success">verified</span><span className="font-body-md text-body-md text-on-background">Validación rigurosa por expertos académicos.</span></li>
                <li className="flex items-start gap-md"><span className="material-symbols-outlined text-success">update</span><span className="font-body-md text-body-md text-on-background">Actualizaciones periódicas basadas en trabajo de campo.</span></li>
                <li className="flex items-start gap-md"><span className="material-symbols-outlined text-success">memory</span><span className="font-body-md text-body-md text-on-background">Tecnología de vanguardia para el procesamiento de datos.</span></li>
              </ul>
            </div>
          </div>
        </section>
        <section id="acerca" className="py-xl px-margin-desktop max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-xs">Acerca de nosotros</h2>
              <div className="h-1 w-16 bg-primary rounded-full mb-lg" />
              <div className="space-y-lg">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-sm">Misión</h3>
                  <p className="font-body-md text-body-md text-secondary leading-relaxed">
                    Centralizar y difundir información turística de la provincia de Loja mediante una plataforma digital interactiva que integre datos geográficos, inventarios de atractivos, investigaciones académicas y servicios externos, para fortalecer la planificación, promoción y gestión sostenible del turismo en la región.
                  </p>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-sm">Visión</h3>
                  <p className="font-body-md text-body-md text-secondary leading-relaxed">
                    Ser la plataforma de referencia para la gestión turística en la provincia de Loja, impulsando el desarrollo sostenible a través de la innovación tecnológica, la investigación académica y la colaboración interinstitucional.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-lg">Contacto</h3>
              <div className="space-y-md">
                <div className="flex items-start gap-md p-md bg-surface rounded-xl border border-outline-variant hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-background font-semibold">Dirección</p>
                    <p className="font-body-md text-body-md text-secondary">Universidad Nacional de Loja, Facultad de la Energía, las Industrias y los Recursos Naturales No Renovables, Loja, Ecuador</p>
                  </div>
                </div>
                <div className="flex items-start gap-md p-md bg-surface rounded-xl border border-outline-variant hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-background font-semibold">Correo electrónico</p>
                    <p className="font-body-md text-body-md text-secondary">contacto@pit-unl.edu.ec</p>
                  </div>
                </div>
                <div className="flex items-start gap-md p-md bg-surface rounded-xl border border-outline-variant hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-background font-semibold">Teléfono</p>
                    <p className="font-body-md text-body-md text-secondary">+593 7 123 4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterPublic />
    </div>
  );
}
