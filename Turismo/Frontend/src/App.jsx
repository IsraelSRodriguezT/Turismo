import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-branding">
          <p className="app-kicker">PIT Frontend</p>
          <h1 className="app-title">Turismo, rutas y planificación</h1>
        </div>
        <Nav />
      </header>

      <main className="app-main">
        <section className="app-panel" aria-labelledby="main-content-title">
          <h2 className="sr-only" id="main-content-title">
            Contenido principal
          </h2>
          <Outlet />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Frontend React preparado para integrar la API Django por módulos.
        </p>
      </footer>
    </div>
  );
}
