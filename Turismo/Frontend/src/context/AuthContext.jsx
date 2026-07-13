import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/httpClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Al montar: leer usuario guardado en localStorage (si lo hay)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('usuario');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // JSON malformado: limpiar
        localStorage.removeItem('usuario');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (nickname, password) => {
    const res = await api.post('/usuarios/login/', { nickname, clave: password });
    const payload = res.data.data;   // { access, refresh, usuario }
    localStorage.setItem('access_token', payload.access);
    localStorage.setItem('refresh_token', payload.refresh);
    localStorage.setItem('usuario', JSON.stringify(payload.usuario));
    setUser(payload.usuario);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/login');
  };

  const hasRole = (role) => {
    if (!user) return false;
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
