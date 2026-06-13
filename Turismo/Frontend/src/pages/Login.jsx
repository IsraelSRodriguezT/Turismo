import React, { useState } from 'react';
import '../styles/tokens.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email y contraseña son obligatorios');
      return;
    }
    setLoading(true);
    try {
      // Consume mock file during development
      const res = await fetch('/specs/004-login-dashboard/mocks/auth.json');
      const data = await res.json();
      console.log('login success', data);
      // TODO: set auth state and redirect to dashboard
    } catch (err) {
      setError('Error al autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center'}}>
      <form onSubmit={handleSubmit} style={{width:360,padding:24,border:'1px solid #e5e7eb',borderRadius:8}} aria-label="login form">
        <h2>Iniciar sesión</h2>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="usuario@ejemplo.com" /></label>
        <label>Contraseña<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="******" /></label>
        {error && <div role="alert" style={{color:'var(--color-danger)'}}>{error}</div>}
        <button type="submit" disabled={loading} style={{marginTop:12,background:'var(--color-primary)',color:'#fff',padding:'8px 12px',borderRadius:6}}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}
