import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FooterPublic from './partials/FooterPublic';

const defaultNoticias = [
  { titulo: 'Lanzamiento del Mapa Interactivo Turístico', resumen: 'Nueva herramienta digital para explorar los atractivos turísticos de la provincia de Loja.', fecha: '15 Jun 2026', imagen: 'https://placehold.co/600x400/e2e8f0/64748b?text=PIT+UNL', categoria: 'Tecnología' },
  { titulo: 'Investigadores UNL publican estudio sobre turismo sostenible', resumen: 'El estudio analiza el impacto del turismo en las comunidades locales.', fecha: '10 Jun 2026', imagen: 'https://placehold.co/600x400/e2e8f0/64748b?text=PIT+UNL', categoria: 'Investigación' },
  { titulo: 'Taller de capacitación para gestores turísticos', resumen: 'La UNL invita al taller de capacitación en gestión de destinos turísticos.', fecha: '5 Jun 2026', imagen: 'https://placehold.co/600x400/e2e8f0/64748b?text=PIT+UNL', categoria: 'Evento' },
];

export default function Home({ noticias = defaultNoticias, totalCantones = 16, totalInvestigaciones = 450, usuariosActivos = '2.4k', coberturaProvincial = 85 }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    localStorage.getItem('pit-dark-mode') === 'true' ||
    (!localStorage.getItem('pit-dark-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleDark = () => {
    const html = document.documentElement;
    const newDark = html.classList.toggle('dark');
    localStorage.setItem('pit-dark-mode', newDark);
    setIsDark(newDark);
  };

  return (
    <div className="pit-app-shell bg-background text-on-surface transition-colors duration-200 antialiased min-h-screen">
      <header className="pit-top-nav w-full top-0 sticky z-50 border-b border-outline-variant shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[1440px] mx-auto">
          <div className="flex items-center gap-xl">
            <Link className="pit-brand text-headline-sm font-headline-sm font-bold text-primary" to="/">PIT UNL</Link>
            <div className="hidden md:flex items-center gap-lg">
              <Link className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1" to="/">Inicio</Link>
              <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" to="/explorador">Explorador</Link>
              <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" to="/reportes">Estadísticas</Link>
              <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" to="/investigacion">Investigación</Link>
            </div>
          </div>
          <div className="flex items-center gap-sm md:gap-md">
            <button onClick={toggleDark} className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-all" title="Modo oscuro">
              <span className="material-symbols-outlined dark:hidden">dark_mode</span>
              <span className="material-symbols-outlined hidden dark:flex">light_mode</span>
            </button>
            {user ? (
              <Link to="/dashboard" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">account_circle</span>{user.nickname || user.nombre || user.email}
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex px-md py-sm font-label-md text-label-md text-secondary hover:text-primary transition-colors">Iniciar Sesión</Link>
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
            <div className="flex flex-col gap-1 pb-sm">
              <Link className="px-sm py-sm rounded-lg bg-primary-fixed text-primary font-semibold" to="/">Inicio</Link>
              <Link className="px-sm py-sm rounded-lg text-on-surface hover:bg-surface-container transition-colors" to="/explorador">Explorador</Link>
              <Link className="px-sm py-sm rounded-lg text-on-surface hover:bg-surface-container transition-colors" to="/reportes">Estadísticas</Link>
              <Link className="px-sm py-sm rounded-lg text-on-surface hover:bg-surface-container transition-colors" to="/investigacion">Investigación</Link>
            </div>
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
        <section className="relative w-full min-h-[65vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://www.cooperativaloja.com/imagenes/ciudad-de-loja.jpg')" }} />
            <div className="absolute inset-0 hero-gradient" />
          </div>
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
              <Link to="/acerca" className="bg-white/10 backdrop-blur-md border border-white/35 text-white px-xl py-md rounded-lg font-label-md text-label-md hover:bg-white/20">Saber más</Link>
            </div>
          </div>
        </section>
        <section className="bg-surface py-xl border-b border-outline-variant">
          <div className="px-margin-desktop max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg">
              <div className="font-headline-md text-headline-md text-primary">{totalCantones}</div>
              <div className="font-label-md text-label-md text-secondary">Cantones</div>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg">
              <div className="font-headline-md text-headline-md text-primary">{totalInvestigaciones}+</div>
              <div className="font-label-md text-label-md text-secondary">Investigaciones</div>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg">
              <div className="font-headline-md text-headline-md text-primary">{usuariosActivos}</div>
              <div className="font-label-md text-label-md text-secondary">Usuarios activos</div>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md md:p-lg">
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
            <div className="bg-surface p-xl rounded-xl border border-technical">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined">explore</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Mapa interactivo</h3>
              <p className="font-body-md text-body-md text-secondary mb-lg">Explora sitios turísticos, servicios y rutas con capas técnicas diseñadas para un análisis geográfico detallado.</p>
              <Link className="text-primary font-label-md inline-flex items-center gap-xs hover:underline" to="/explorador">Ver mapa <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
            <div className="bg-surface p-xl rounded-xl border border-technical">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Inventario digital</h3>
              <p className="font-body-md text-body-md text-secondary mb-lg">Accede a fichas técnicas estandarizadas de cada sitio, con datos integrales para promoción y planificación.</p>
              <Link className="text-primary font-label-md inline-flex items-center gap-xs hover:underline" to="/lista-atractivos">Explorar fichas <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
            <div className="bg-surface p-xl rounded-xl border border-technical">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-md">Investigación académica</h3>
              <p className="font-body-md text-body-md text-secondary mb-lg">Datos crudos y procesados para proyectos de tesis y toma de decisiones, curados por la excelencia académica de la UNL.</p>
              <Link className="text-primary font-label-md inline-flex items-center gap-xs hover:underline" to="/investigacion">Base de datos <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
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
        <section className="py-xl px-margin-desktop max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-xl gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-xs">Actualidad y novedades</h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
            <Link to="/explorador" className="text-primary font-label-md text-label-md hover:underline flex items-center gap-xs">Ver todas <span className="material-symbols-outlined">chevron_right</span></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {noticias.slice(0, 3).map((noticia, i) => (
              <article key={i} className="flex flex-col bg-surface rounded-xl overflow-hidden border border-technical">
                <div className="h-48 bg-surface-container relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5" />
                  <img className="w-full h-full object-cover" src={noticia.imagen} alt={noticia.titulo}
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=PIT+UNL'; e.target.onerror = null; }} />
                  <span className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">{noticia.categoria}</span>
                </div>
                <div className="p-lg">
                  <time className="font-label-sm text-label-sm text-secondary block mb-xs">{noticia.fecha}</time>
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-md leading-tight">{noticia.titulo}</h3>
                  <p className="font-body-md text-body-md text-secondary line-clamp-2">{noticia.resumen}</p>
                </div>
              </article>
            ))}
          </div>
          {noticias.length > 3 && (
            <div className="text-center mt-lg">
              <Link to="/explorador" className="inline-flex items-center gap-2 text-primary font-label-md hover:underline">Ver más noticias <span className="material-symbols-outlined">arrow_forward</span></Link>
            </div>
          )}
        </section>
      </main>
      <FooterPublic />
    </div>
  );
}
