'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from 'react-icons/fa';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PlantasPage() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedPlants, setSavedPlants] = useState([]);
  const [checkedPlants, setCheckedPlants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Cargar plantas guardadas al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('savedPlants');
    if (saved) {
      setSavedPlants(JSON.parse(saved));
    }
  }, []);

  // Cargar plantas seleccionadas al iniciar
  useEffect(() => {
    const checked = localStorage.getItem('checkedPlants');
    if (checked) {
      setCheckedPlants(JSON.parse(checked));
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('checkedPlants', JSON.stringify(checkedPlants));
  }, [checkedPlants]);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };

  const handleRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSavePlant = async (plant, idx) => {
    // Guardar todas las imágenes subidas en base64
    const imageUrl = await Promise.all(files.map(fileToBase64)); // ahora es un array
    console.log('Imágenes convertidas a base64:', imageUrl.length);
    // Obtener userId del usuario autenticado
    const user = sessionStorage.getItem('user');
    let userId = null;
    if (user) {
      try {
        userId = JSON.parse(user).id;
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }
    if (!userId) {
      setError('No se ha encontrado el usuario autenticado.');
      return;
    }
    // Limpiar apiData para que sea serializable
    const apiData = JSON.parse(JSON.stringify(plant));
    // LOG: Ver qué se envía al backend
    console.log('Enviando a la BD:', {
      userId,
      apiData,
      imageUrl
    });
    try {
      // Guardar en la base de datos
      const res = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          apiData,
          imageUrl
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar la planta');
      }
      const savedPlant = await res.json();
      console.log('Planta guardada:', savedPlant);
      router.push('/');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error.message);
    }
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

  function renderResults() {
    if (!result || !result.results || result.results.length === 0) return null;
    const topResults = [...result.results]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    // Si hay 3 resultados, poner el de mayor score en el centro
    let orderedResults = topResults;
    if (topResults.length === 3) {
      orderedResults = [topResults[1], topResults[0], topResults[2]];
    }
    return (
      <div className="mt-6 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
        {orderedResults.map((item, idx) => {
          const species = item.species;
          const score = (item.score * 100).toFixed(1);
          const imageUrl = item.images?.[0]?.url || null;
          const scientificName = species.scientificNameWithoutAuthor || species.scientificName;
          const family = species.family?.scientificName || 'No especificada';
          return (
            <div key={idx} className="bg-[#f5f7f9] border border-[#d1d5db] rounded-xl shadow p-6 flex flex-col items-center transition-colors duration-200 hover:bg-[#e9ecef]">
              <h3 className="text-xl font-bold text-green-800 mb-2 text-center">{scientificName}</h3>
              <p className="text-gray-800 text-lg mb-1 text-center">Score: <span className="font-bold">{score}%</span></p>
              <p className="text-gray-500 text-base text-center italic">Familia: {family}</p>
              <button
                onClick={() => handleSavePlant({ scientificName, family, score }, idx)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-base font-semibold"
              >
                Guardar
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // Renderizar biblioteca de plantas guardadas
  function renderSavedPlants() {
    if (!savedPlants || savedPlants.length === 0) return null;
    return (
      <div className="mt-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mx-auto">
        {savedPlants.map((plant, idx) => {
          const isChecked = checkedPlants.includes(plant.apiData.scientificName);
          return (
            <div key={idx} className="relative bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col items-center">
              <button
                className={`absolute top-2 right-2 text-2xl focus:outline-none ${isChecked ? 'text-green-600' : 'text-gray-300'}`}
                title={isChecked ? 'Quitar de selección' : 'Seleccionar para el jardín'}
                onClick={() => {
                  setCheckedPlants(prev =>
                    isChecked
                      ? prev.filter(name => name !== plant.apiData.scientificName)
                      : [...prev, plant.apiData.scientificName]
                  );
                }}
              >
                <FaCheckCircle />
              </button>
              <img
                src={Array.isArray(plant.imageUrl) ? plant.imageUrl[0] : plant.imageUrl}
                alt={plant.apiData.scientificName}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold text-green-800 mb-1 text-center">{plant.apiData.scientificName}</h3>
              <p className="text-gray-600 text-sm text-center">Familia: {plant.apiData.family}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Escanear Plantas</h1>
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
      <div className="w-full max-w-2xl flex justify-center gap-12 mb-8">
        {files.map((file, idx) => (
          <div key={idx} className="group cursor-pointer" onClick={() => handleRemove(idx)} title="Quitar imagen">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-32 h-32 object-cover rounded border border-gray-300 shadow-md group-hover:opacity-70 transition-opacity duration-150"
            />
          </div>
        ))}
      </div>
      {files.length > 0 && (
        <button
          onClick={handleIdentify}
          disabled={files.length < 3 || loading}
          className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Identificando...' : 'Identificar Planta'}
        </button>
      )}
      {error && (
        <div className="mt-4 text-red-600 font-semibold">{error}</div>
      )}
      {result && renderResults()}
      {renderSavedPlants()}
    </div>
  );
}