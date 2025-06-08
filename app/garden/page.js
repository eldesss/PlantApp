'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DotLoader } from "react-spinners";
import { Sparkles } from "lucide-react";
import { motion } from 'framer-motion';

export default function MiJardin() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [imgJardin, setImgJardin] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(null);
  const [estilo, setEstilo] = useState('');
  const [userPlants, setUserPlants] = useState([]);
  const [imgVisible, setImgVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }
    const { id: userId } = JSON.parse(user);
    fetch('/api/plants')
      .then(res => res.json())
      .then(data => {
        const userPlants = data.filter(p => p.userId === userId);
        const checked = JSON.parse(localStorage.getItem('checkedPlants') || '[]');
        const checkedNames = checked.map(p => p.name);
        const checkedPlants = userPlants.filter(p =>
          checkedNames.includes(p.apiData.scientificName || p.apiData.scientificNameWithoutAuthor)
        );
        setPlants(userPlants);
        setUserPlants(checkedPlants);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleGenerarJardin = async () => {
    if (userPlants.length === 0) return;
    setImgLoading(true);
    setImgError(null);
    try {
      const nombres = userPlants.map(p => p.apiData.scientificName || p.apiData.scientificNameWithoutAuthor).filter(Boolean);
      const res = await fetch('/api/garden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres, estilo })
      });
      const data = await res.json();
      console.log('Respuesta del backend:', data);
      if (data.image) {
        setImgVisible(false);
        setImgJardin(data.image);
      } else {
        setImgError(data.error || 'No se pudo generar la imagen');
      }
    } catch (e) {
      setImgError('Error al generar la imagen');
    }
    setImgLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 to-green-100 z-0">
      <main className="container mx-auto px-4 py-8 relative z-0">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-8xl mt-8 mb-6 text-center font-display text-fill-green text-outline relative z-10 font-bo font-leafy font-bold"
        >
          Jardin
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center w-full max-w-md mx-auto z-1 mb-6 z-1"
        >
          <label className="block mb-2 text-green-900 font-semibold text-center w-full z-1" htmlFor="estilo-jardin">
            ¿Qué estilo quieres para tu jardín?
          </label>
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none">
              <Sparkles size={22} />
            </span>
            <input
              id="estilo-jardin"
              type="text"
              className="w-full max-w-md pl-10 pr-4 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-lg bg-white text-gray-900 font-sans placeholder:text-gray-400"
              placeholder="Ejemplo: japonés, moderno, con muchas flores, minimalista..."
              value={estilo}
              onChange={e => setEstilo(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`mt-4 w-full font-bold z-1 py-2 px-4 rounded text-lg shadow-lg transition-colors duration-500 bg-green-600
              ${estilo.trim().length > 0 && userPlants.length > 0
                ? 'rainbow-animated-gradient'
                : 'hover:bg-green-700 text-white'}
            `}
            onClick={handleGenerarJardin}
            disabled={imgLoading || userPlants.length === 0}
          >
            Generar jardín
          </motion.button>
        </motion.div>
        {imgLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 mb-4 z-1"
          >
            Generando imagen de tu jardín...
          </motion.div>
        )}
        {imgError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-600 mb-4 z-1"
          >
            {imgError}
          </motion.div>
        )}
        {imgJardin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-8 z-1"
          >
            <Image
              src={imgJardin}
              alt="Jardín generado"
              className={`rounded-2xl shadow-2xl max-w-2xl w-full object-contain border-4 border-green-200 transition-opacity duration-1000 ${imgVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ minHeight: 350, background: "#fff" }}
              onLoad={() => setImgVisible(true)}
              width={1200}
              height={800}
            />
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={imgJardin}
              download="mi-jardin.png"
              className="mt-8 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg"
            >
              Descargar imagen
            </motion.a>
          </motion.div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-full mt-64">
            <DotLoader color="#16a34a" size={60} />
          </div>
        ) : userPlants.length === 0 && !imgLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-600 font-sans"
          >
            <p className="text-lg mt-56">No has seleccionado plantas para tu jardín.</p>
            <p className="mt-2">Ve a la página de <Link href="/plants" className="text-green-600 hover:text-green-800 underline">biblioteca</Link> y selecciona las plantas que quieras incluir.</p>
          </motion.div>
        ) : null}

        {/* Modal de detalles de la planta */}
        {selectedPlant && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-green-800 font-display">
                  {selectedPlant.apiData.scientificName || selectedPlant.apiData.scientificNameWithoutAuthor}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPlant(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </motion.button>
              </div>
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden">
                <Image
                  src={Array.isArray(selectedPlant.imageUrl) ? selectedPlant.imageUrl[0] : selectedPlant.imageUrl}
                  alt={selectedPlant.apiData.scientificName}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
              </div>
              <div className="space-y-2 text-gray-700 font-sans">
                <p><strong>Familia:</strong> {selectedPlant.apiData.family || 'No especificada'}</p>
                <p><strong>Género:</strong> {selectedPlant.apiData.genus || 'No especificado'}</p>
                {selectedPlant.apiData.commonNames && (
                  <p><strong>Nombres comunes:</strong> {selectedPlant.apiData.commonNames}</p>
                )}
                {selectedPlant.apiData.description && (
                  <p><strong>Descripción:</strong> {selectedPlant.apiData.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 