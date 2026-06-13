import React, { useEffect, useState } from 'react';
import CardIndicator from '../components/CardIndicator';
import '../styles/tokens.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('/specs/004-login-dashboard/mocks/dashboard.json');
        const json = await res.json();
        setData(json);
      }catch(e){
        console.error(e);
      }finally{ setLoading(false); }
    }
    load();
  },[])

  if(loading) return <div style={{padding:24}}>Cargando...</div>
  if(!data) return <div style={{padding:24}}>Error al cargar datos</div>

  return (
    <main style={{padding:24}}>
      <h1>Dashboard</h1>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
        {data.indicators.map((i)=> <CardIndicator key={i.key} title={i.key} value={i.value} trend={i.trend} />)}
      </section>
    </main>
  );
}
