import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: '¿Cómo registro un nuevo atractivo turístico?',
    a: 'Ve a Inventario > Atractivos en el menú lateral y haz clic en "Agregar Atractivo". Completa el formulario con los datos del atractivo, incluyendo nombre, ubicación, clasificación y recursos multimedia.',
  },
  {
    q: '¿Cómo añadir imágenes a un atractivo?',
    a: 'Dentro del formulario de creación o edición de un atractivo, verás la sección "Recursos". Selecciona "IMAGEN" como tipo, sube el archivo y guarda los cambios.',
  },
  {
    q: '¿Cómo generar un reporte de atractivos?',
    a: 'Ve a Inventario > Reportes en el menú lateral, selecciona los filtros deseados (clasificación, accesibilidad, fechas) y haz clic en "Generar Reporte". Puedes exportar los resultados a CSV.',
  },
  {
    q: '¿Cómo funciona el mapa interactivo?',
    a: 'El explorador de atractivos muestra un mapa con marcadores de todos los atractivos registrados. Puedes filtrar por provincia, accesibilidad o buscar por nombre. Haz clic en los marcadores para ver detalles.',
  },
  {
    q: '¿Cómo gestionar usuarios?',
    a: 'Los administradores pueden gestionar usuarios desde la sección Usuarios en el menú lateral. Allí podrás crear, editar y desactivar cuentas de usuario.',
  },
  {
    q: '¿Qué hacer si tengo problemas con el sistema?',
    a: 'Revisa esta sección de ayuda primero. Si el problema persiste, contacta al administrador del sistema o envía un correo a soporte@pitloja.gob.ec',
  },
];

const SECCIONES = [
  {
    icono: 'add_location',
    titulo: 'Gestión de Atractivos',
    desc: 'Aprende a crear, editar y eliminar atractivos turísticos, gestionar sus recursos multimedia y clasificaciones.',
    link: '/admin/atractivos',
  },
  {
    icono: 'assessment',
    titulo: 'Reportes y Estadísticas',
    desc: 'Genera reportes personalizados con filtros por clasificación, accesibilidad y rango de fechas. Exporta a CSV.',
    link: '/admin/reportes',
  },
  {
    icono: 'map',
    titulo: 'Mapa y Geolocalización',
    desc: 'Explora atractivos en el mapa interactivo, filtra por provincia y descubre puntos de interés turístico.',
    link: '/explorador',
  },
  {
    icono: 'group',
    titulo: 'Gestión de Usuarios',
    desc: 'Administra cuentas de usuario, roles y permisos dentro de la plataforma.',
    link: '/usuarios',
  },
  {
    icono: 'science',
    titulo: 'Investigación',
    desc: 'Accede a la sección de investigación para gestionar proyectos y datos científicos relacionados al turismo.',
    link: '/admin/investigacion',
  },
  {
    icono: 'settings',
    titulo: 'Configuración',
    desc: 'Personaliza tu perfil, cambia tu contraseña y ajusta las preferencias de la plataforma.',
    link: '/settings',
  },
];

export default function Ayuda() {
  const [faqAbierto, setFaqAbierto] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const seccionesFiltradas = busqueda
    ? SECCIONES.filter(s => s.titulo.toLowerCase().includes(busqueda.toLowerCase()) || s.desc.toLowerCase().includes(busqueda.toLowerCase()))
    : SECCIONES;

  const faqsFiltradas = busqueda
    ? FAQS.filter(f => f.q.toLowerCase().includes(busqueda.toLowerCase()) || f.a.toLowerCase().includes(busqueda.toLowerCase()))
    : FAQS;

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Ayuda</span>
      </nav>

      {/* Hero / Search */}
      <div className="bg-surface rounded-xl border border-outline-variant p-xl mb-xl text-center">
        <span className="material-symbols-outlined text-[48px] text-primary mb-md">help</span>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-sm">Centro de Ayuda</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto mb-lg">
          Encuentra respuestas a tus preguntas sobre la Plataforma Interactiva de Turismo de Loja
        </p>
        <div className="max-w-md mx-auto relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar ayuda..."
            className="w-full pl-xl pr-md py-3 border border-outline rounded-xl font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none" />
        </div>
      </div>

      {/* Secciones de ayuda */}
      <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Secciones</h2>
      {seccionesFiltradas.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] block mb-sm">search_off</span>
          <p className="font-body-md">No hay resultados para "{busqueda}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xl">
          {seccionesFiltradas.map((s, i) => (
            <Link key={i} to={s.link}
              className="bg-surface rounded-xl border border-outline-variant p-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-sm bg-primary-fixed text-primary rounded-lg inline-flex mb-md">
                <span className="material-symbols-outlined">{s.icono}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-sm group-hover:text-primary transition-colors">{s.titulo}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{s.desc}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Preguntas Frecuentes */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden mb-xl">
        <div className="p-lg border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Preguntas Frecuentes</h2>
        </div>
        {faqsFiltradas.length === 0 ? (
          <div className="text-center py-xl text-on-surface-variant">
            <p className="font-body-md">No hay preguntas frecuentes para "{busqueda}"</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {faqsFiltradas.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  className="w-full flex items-center justify-between px-lg py-md text-left hover:bg-surface-container-low transition-colors">
                  <span className="font-body-md font-medium text-on-surface flex-1 pr-md">{faq.q}</span>
                  <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${faqAbierto === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {faqAbierto === i && (
                  <div className="px-lg pb-md">
                    <p className="font-body-md text-body-md text-on-surface-variant pl-md border-l-2 border-primary">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contacto */}
      <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
        <span className="material-symbols-outlined text-[40px] text-primary mb-sm">mail</span>
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-sm">¿Necesitas más ayuda?</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-md mx-auto">
          Si no encuentras lo que buscas, contáctanos y te ayudaremos a resolverlo
        </p>
        <a href="mailto:soporte@pitloja.gob.ec"
          className="inline-flex items-center gap-md px-lg py-md bg-primary text-on-primary rounded-xl font-label-md font-bold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined">mail</span>
          Contactar Soporte
        </a>
      </div>
    </>
  );
}
