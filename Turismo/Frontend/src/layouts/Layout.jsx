import React, { useState, useEffect } from 'react';
import UserPanel from '../pages/web/partials/UserPanel';
import Footer from '../pages/web/partials/Footer';
import { useAuth } from '../context/AuthContext';

function Layout({ children, title = 'PIT - Plataforma Interactiva de Turismo' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('pit-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'true' || (!stored && prefersDark);
    setIsDark(dark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newDark = html.classList.toggle('dark');
    localStorage.setItem('pit-dark-mode', newDark);
    setIsDark(newDark);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex min-h-screen bg-background">
      <UserPanel />
      <main className="ml-0 lg:ml-64 min-h-screen flex flex-col flex-1">
        <header className="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 bg-surface border-b border-outline-variant">
          <div className="flex items-center gap-md">
            <button onClick={toggleSidebar} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">{title}</h1>
          </div>
          <div className="flex items-center gap-lg">
            <div className="relative hidden lg:block">
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:ring-2 focus:ring-focus-ring outline-none w-64"
                placeholder="Buscar en la plataforma..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant">search</span>
            </div>
            <div className="flex items-center gap-sm">
              <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="h-8 w-px bg-outline-variant mx-2"></div>
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center gap-sm p-1 rounded-lg hover:bg-surface-container transition-colors">
                  <img
                    alt="User profile"
                    className="w-8 h-8 rounded-full border border-outline-variant"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiy5evHs1UoiGCKN6luiIfGmOPpjpF1sTwER5GgWO_gTCajiZEunb8Sf2zx30l42_UckNt38A3zvmMOXRf8XWy7eipr3JNkWrJ4I5J4zjEtT9YbH1UIB7Lki0Xgu9u_2pflywZom0lfbp8KIhakRiruwMouaGBNzx7cV6UtWwpVgk7vSSoBLoZBph539ZucDTC3vltBBUv2d9MGTAdFqjlATNm6p8H_B6A7_3sZ0hp9IbEnf8muZ_z2oZy7ddjx1jH5nyh77wyUvsq"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
                    <a href="/perfil" className="flex items-center gap-md px-lg py-sm font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span>Mi Perfil</span>
                    </a>
                    <a href="/settings" className="flex items-center gap-md px-lg py-sm font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-sm">settings</span>
                      <span>Configuración</span>
                    </a>
                    <hr className="border-outline-variant" />
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-md px-lg py-sm font-label-md text-label-md text-danger hover:bg-error-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="p-margin-desktop flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Layout;
