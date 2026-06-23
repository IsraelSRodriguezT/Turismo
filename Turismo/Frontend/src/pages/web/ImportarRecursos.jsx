import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/httpClient';

export default function ImportarRecursos() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Selecciona un archivo CSV o XLSX');
      return;
    }
    setLoading(true);
    setError('');
    setResultado(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/inventario/recursos/importar/', formData);
      setResultado(res.data?.data || res.data || {});
    } catch (err) {
      const data = err.response?.data;
      const details = data?.errors?.details;
      const detailMsg = details ? details.map(d => d.message).join('; ') : data?.message || data?.detail || 'Error al importar';
      setError(detailMsg);
      console.error('Error importar:', data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="flex items-center gap-xs text-on-surface-variant mb-lg font-label-md text-label-md">
        <Link to="/dashboard" className="hover:text-primary">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-surface">Importar Recursos</span>
      </nav>

      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Importar Recursos desde Archivo</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Sube un archivo CSV o XLSX para importar recursos multimedia</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-surface rounded-xl border border-outline-variant p-lg mb-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Formato del Archivo</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            El archivo debe contener las siguientes columnas:
          </p>
          <div className="bg-surface-container-low p-md rounded-lg font-body-md text-body-md text-on-surface mb-md">
            <code className="block">titulo, descripcion, url, tipo_recurso</code>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <span className="font-bold">tipo_recurso</span> puede ser: IMAGEN, VIDEO, DOCUMENTO o INFOGRAFIA
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-lg">
              <label className="block font-label-md text-label-md font-bold text-on-surface mb-sm">
                Seleccionar Archivo
              </label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-xl text-center hover:border-primary transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('file-input').click()}
              >
                {file ? (
                  <div>
                    <span className="material-symbols-outlined text-[48px] text-primary">description</span>
                    <p className="font-body-md text-body-md text-on-surface mt-sm">{file.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant">upload_file</span>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                      Arrastra un archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">CSV o XLSX</p>
                  </div>
                )}
                <input id="file-input" type="file" accept=".csv,.xlsx,.xls" className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            {error && (
              <div className="p-md mb-lg bg-error-container text-error rounded-lg font-body-md">
                <span className="material-symbols-outlined text-[18px] align-middle mr-xs">error</span>
                {error}
              </div>
            )}

            {resultado && (
              <div className="p-md mb-lg bg-success-container text-success rounded-lg">
                <h3 className="font-label-md text-label-md font-bold mb-sm">
                  <span className="material-symbols-outlined text-[18px] align-middle mr-xs">check_circle</span>
                  Importación completada
                </h3>
                <p className="font-body-md text-body-md">Creados: {resultado.created || 0}</p>
                {resultado.skipped?.length > 0 && (
                  <p className="font-body-md text-body-md">Omitidos (duplicados): {resultado.skipped.length}</p>
                )}
                {resultado.errors?.length > 0 && (
                  <div className="mt-sm">
                    <p className="font-body-md text-body-md text-danger">Errores: {resultado.errors.length}</p>
                    <ul className="list-disc pl-lg font-body-sm text-body-sm">
                      {resultado.errors.map((e, i) => <li key={i}>Fila {e.row}: {e.error}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading || !file}
              className="w-full py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-sm">
                  <span className="material-symbols-outlined animate-spin">autorenew</span>
                  Importando...
                </span>
              ) : 'Importar Archivo'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}