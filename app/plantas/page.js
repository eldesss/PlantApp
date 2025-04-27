'use client';
import { useState } from "react";

export default function PlantasPage() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };

  const handleRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleIdentify = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      files.forEach(() => formData.append('organs', 'auto'));
      // No agregar lang ni type al FormData
      // Llamada a la API local (Next.js API Route)
      const res = await fetch('/api/plantnet', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Error en la identificación: ' + errorText);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar los 3 mejores resultados
  function renderResults() {
    if (!result || !result.results || result.results.length === 0) return null;
    // Ordenar por score descendente y tomar los 3 primeros
    const topResults = [...result.results]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return (
      <div className="mt-6 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
        {topResults.map((item, idx) => {
          const species = item.species;
          const score = (item.score * 100).toFixed(1);
          const imageUrl = item.images?.[0]?.url || null;
          const scientificName = species.scientificNameWithoutAuthor || species.scientificName;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              {imageUrl && (
                <img src={imageUrl} alt={scientificName} className="w-32 h-32 object-cover rounded mb-2 border" />
              )}
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">{scientificName}</h3>
              <p className="text-gray-700 text-sm mb-1 text-center">Score: <span className="font-semibold">{score}%</span></p>
              <p className="text-gray-500 text-xs text-center italic">Familia: {species.family?.scientificName || '-'}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Página de Plantas</h1>
      <label className="cursor-pointer bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800 mb-4 font-semibold">
        Adjuntar imágenes
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </label>
      <div className="w-full max-w-md space-y-4 mb-4">
        {files.map((file, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <span className="truncate flex-1 text-gray-900">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-red-600 font-bold text-lg px-2 hover:text-red-800 focus:outline-none"
              title="Quitar archivo"
            >
              ×
            </button>
            <div className="w-32 h-2 bg-gray-200 rounded">
              <div className="h-2 bg-green-400 rounded" style={{ width: '100%' }}></div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleIdentify}
        disabled={files.length === 0 || loading}
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Identificando...' : 'Identificar Planta'}
      </button>
      {error && (
        <div className="mt-4 text-red-600 font-semibold">{error}</div>
      )}
      {result && renderResults()}
    </div>
  );
}