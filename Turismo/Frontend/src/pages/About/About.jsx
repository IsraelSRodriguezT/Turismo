export default function About() {
  return (
    <div className="page-stack">
      <article className="page-card">
        <p className="app-kicker">Acerca de</p>
        <h2>Proyecto PIT</h2>
        <p className="app-text">
          La aplicación reúne la base del frontend para acompañar la
          planificación, exploración y gestión de actividades turísticas en
          Loja.
        </p>
      </article>

      <section className="page-card" aria-labelledby="about-structure-title">
        <h3 id="about-structure-title">Criterios de diseño</h3>
        <ul className="page-list">
          <li>Información turística clara y actualizada.</li>
          <li>Organización por módulos para el backend.</li>
          <li>Base preparada para crecer con nuevas funciones.</li>
        </ul>
      </section>
    </div>
  );
}