export default function UserProfile() {
  return (
    <div className="page-stack">
      <article className="page-card">
        <p className="app-kicker">Perfil</p>
        <h2>Perfil y preferencias</h2>
        <p className="app-text">
          Este espacio queda listo para consultar recomendaciones e itinerarios del usuario dentro de PIT.
        </p>
      </article>

      <section className="page-card" aria-labelledby="profile-data-title">
        <h3 id="profile-data-title">Datos de ejemplo</h3>
        <ul className="page-list">
          <li>Nombre: Usuario PIT</li>
          <li>Estado: plantilla inicial</li>
          <li>Conexión: preparada para API</li>
        </ul>
      </section>
    </div>
  );
}