import { NavLink } from 'react-router-dom';

const linkClassName = ({ isActive }) =>
  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link';

export default function Nav() {
  return (
    <nav className="app-nav" aria-label="Navegación principal">
      <NavLink className={linkClassName} to="/" end>
        Inicio
      </NavLink>
      <NavLink className={linkClassName} to="/about">
        Acerca de
      </NavLink>
      <NavLink className={linkClassName} to="/profile">
        Perfil
      </NavLink>
    </nav>
  );
}