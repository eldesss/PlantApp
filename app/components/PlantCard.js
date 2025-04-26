'use client';

import { useState } from 'react';
import { identifyPlant } from '../api/plants';

export default function PlantCard({ name, type, emoji, imageUrl }) {
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsIdentifying(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        const result = await identifyPlant(base64Image);
        setResult(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
    } finally {
      setIsIdentifying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagen de la planta */}
      <div className="h-48 bg-green-100 flex items-center justify-center relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">{emoji}</span>
        )}
      </div>

      {/* Información de la planta */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-1">{name}</h2>
        <p className="text-sm text-gray-600 mb-2">Familia: {type}</p>
        
        {/* Botón para identificar planta */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Identificar planta
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm w-full"
            disabled={isIdentifying}
          />
        </div>

        {/* Estado de identificación */}
        {isIdentifying && (
          <div className="text-sm text-green-600 mb-2">
            Identificando planta...
          </div>
        )}
        
        {/* Resultado de la identificación */}
        {result && (
          <div className="mt-2 p-2 bg-green-50 rounded">
            <p className="text-sm font-medium text-green-800">
              Resultado: {result.species?.scientificName || 'No identificado'}
            </p>
            <p className="text-xs text-green-600">
              Confianza: {Math.round(result.species?.score * 100)}%
            </p>
          </div>
        )}

        {/* Botón de detalles */}
        <button className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors mt-2">
          Ver detalles
        </button>
      </div>
    </div>
  );
} 