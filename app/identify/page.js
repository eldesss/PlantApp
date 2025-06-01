'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from 'react-icons/fa';
import { Search, Loader, Upload } from 'lucide-react';
import Image from 'next/image';

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
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);
  const router = useRouter();
  const [disabledSave, setDisabledSave] = useState(false);
  const [showMinImagesWarning, setShowMinImagesWarning] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/');
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

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => {
      const nuevos = prevFiles.concat(selectedFiles).slice(0, 3);
      return nuevos;
    });
    setResult(null);
    setError(null);
  };

  const handleRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSavePlant = async (plant, idx) => {
    setDisabledSave(true);
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
      router.push('/plants');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error.message);
    }
  };

  const handleIdentify = async () => {
    if (files.length < 3) {
      setShowMinImagesWarning(true);
      return;
    }
    setShowMinImagesWarning(false);
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
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-base font-semibold disabled:opacity-50"
                disabled={disabledSave}
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
    // Filtrar plantas según el valor de búsqueda
    const plantasFiltradas = savedPlants.filter(plant => {
      const nombre = plant.apiData.scientificName?.toLowerCase() || "";
      const familia = plant.apiData.family?.toLowerCase() || "";
      return (
        nombre.includes(valorBusqueda.toLowerCase()) ||
        familia.includes(valorBusqueda.toLowerCase())
      );
    });
    return (
      <div className="mt-2 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mx-auto">
        {plantasFiltradas.map((plant, idx) => {
          const isChecked = checkedPlants.includes(plant.apiData.scientificName);
          return (
            <div key={idx} className="relative bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col items-center">
              <button
                className={`absolute top-2 right-2 text-2xl focus:outline-none ${isChecked ? 'text-green-600' : 'text-gray-300'}`}
                title={isChecked ? 'Quitar de selección' : 'Seleccionar para el jardín'}
                onClick={() => {
                  setCheckedPlants(prev => {
                    let updated;
                    if (isChecked) {
                      updated = prev.filter(name => name !== plant.apiData.scientificName);
                    } else {
                      updated = [...prev, plant.apiData.scientificName];
                    }
                    localStorage.setItem('checkedPlants', JSON.stringify(updated));
                    return updated;
                  });
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

  // Drag & Drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const filesArr = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (filesArr.length > 0) {
      setFiles(filesArr.slice(0, 3)); // máximo 3 imágenes
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 transition-all duration-200 ${isDragging ? 'ring-4 ring-green-400 bg-green-100' : ''}`}
    >
      <h1 className="text-3xl font-bold text-green-800 mb-6">Identificar Plantas</h1>
      <label className="cursor-pointer bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800 mb-4 font-semibold flex items-center gap-2">
      <Upload className="w-5 h-5 mr-2" />
        Adjuntar imágenes
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </label>
      {isDragging && (
        <div className="mb-4 text-green-700 font-semibold animate-pulse">Suelta aquí tus imágenes...</div>
      )}
      <div className="w-full max-w-2xl flex justify-center gap-12 mb-8">
        {files.map((file, idx) => (
          <div key={idx} className="group cursor-pointer" onClick={() => handleRemove(idx)} title="Quitar imagen">
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-32 h-32 object-cover rounded border border-gray-300 shadow-md group-hover:opacity-70 transition-opacity duration-150"
              width={128}
              height={128}
              unoptimized
            />
          </div>
        ))}
      </div>
      {showMinImagesWarning && (
        <div className="mb-4 px-4 py-2 rounded border text-green-900 bg-green-100 border-green-700 font-semibold">
          Debes adjuntar al menos 3 imágenes para identificar la planta.
        </div>
      )}
      {files.length > 0 && (
        <button
          onClick={handleIdentify}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader className="w-8 h-8 text-green-700 animate-spin" />
            </div>
          ) : 'Identificar Planta'}
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