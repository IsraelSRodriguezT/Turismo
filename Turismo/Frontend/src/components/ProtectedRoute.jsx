import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Envuelve rutas que requieren autenticación.
 * - Mientras verifica la sesión: muestra spinner.
 * - Sin sesión: redirige a /login.
 * - Con sesión: muestra el children.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
          <p className="font-body-md text-on-surface-variant mt-4">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
