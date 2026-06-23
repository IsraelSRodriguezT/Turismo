import React from 'react';
import { Link } from 'react-router-dom';

export default function Perfil() {
  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Mi Perfil</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg text-center">
            <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-primary text-[40px]">person</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface" id="perfilNombre">Usuario</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md" id="perfilCorreo">usuario@unl.edu.ec</p>
            <div className="inline-flex items-center gap-xs px-md py-sm bg-primary-fixed rounded-full">
              <span className="material-symbols-outlined text-primary text-[16px]">badge</span>
              <span className="font-label-md text-label-md text-primary font-semibold" id="perfilRol">Turista</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-outline-variant p-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Editar Perfil</h2>
            <form className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="nombre">Nombre</label>
                  <input id="nombre" name="nombre" type="text"
                    className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="apellido">Apellido</label>
                  <input id="apellido" name="apellido" type="text"
                    className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="telefono">Teléfono</label>
                <input id="telefono" name="telefono" type="tel"
                  className="w-full px-md py-3 border border-outline rounded-lg font-body-md bg-surface-container-lowest focus:ring-2 focus:ring-focus-ring outline-none transition-all" />
              </div>
              <div className="flex gap-md">
                <button type="submit" className="px-xl py-3 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all">Guardar Cambios</button>
                <button type="button" className="px-xl py-3 border border-outline-variant text-on-surface rounded-lg font-label-md hover:bg-surface-container-low transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
