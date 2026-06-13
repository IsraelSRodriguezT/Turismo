export default function Home() {
  return (
    <div className="page-stack">
      <article className="page-card">
        <p className="app-kicker">Inicio</p>
        <h2>Bienvenido al frontend de PIT</h2>
        <p className="app-text">
          Esta vista actúa como portada inicial del sistema y deja lista la base
          para la navegación, la documentación y la futura integración con las
          APIs del backend.
        </p>
      </article>

      <section className="page-card" aria-labelledby="home-features-title">
        <h3 id="home-features-title">Estado actual</h3>
        <ul className="page-list">
          <li>Backend con endpoints organizados por módulos.</li>
          <li>Frontend React + Vite configurado.</li>
          <li>Navegación inicial lista para continuar.</li>
        </ul>
      </section>
    </div>
  );
}