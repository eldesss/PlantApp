'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlantCard from '@/components/plants/PlantCard';

function PlantModal({ plant, onClose }) {
  const [show, setShow] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    setShow(true);
    setSelectedImg(0);
    return () => setShow(false);
  }, [plant]);

  // Obtener las imágenes del array imageUrl (Json)
  let imagesToShow = [];
  if (plant && plant.imageUrl && Array.isArray(plant.imageUrl)) {
    imagesToShow = plant.imageUrl;
  } else if (plant && plant.imageUrl && typeof plant.imageUrl === 'string') {
    try {
      const imgs = JSON.parse(plant.imageUrl);
      if (Array.isArray(imgs)) imagesToShow = imgs;
    } catch {}
  }

  // Función para parsear las imágenes de manera segura
  const parseUserImages = (plant) => {
    if (!plant) return [];
    try {
      if (Array.isArray(plant.userImages)) {
        return plant.userImages;
      }
      if (typeof plant.userImages === 'string') {
        const parsed = JSON.parse(plant.userImages);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error al parsear userImages:', error);
      return [];
    }
  };

  // Obtener las imágenes de manera segura
  const userImages = parseUserImages(plant);
  console.log('Imágenes en modal:', userImages.length);

  // Usar userImages, y si no hay, usar imageUrl
  const imagesToShowFinal = userImages.length > 0 ? userImages : imagesToShow;

  if (!plant) return null;

  // Nombres comunes y sinónimos pueden ser array o string
  const commonNames = Array.isArray(plant.commonNames) ? plant.commonNames : (plant.commonNames ? [plant.commonNames] : []);
  const synonyms = Array.isArray(plant.synonyms) ? plant.synonyms : (plant.synonyms ? [plant.synonyms] : []);

  return (
    <div
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-green-50 rounded-lg shadow-2xl border border-green-200 max-w-2xl w-full p-10 relative transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-6 text-green-800 text-center">Información de la Planta</h2>
        {/* Carrusel de imágenes */}
        {imagesToShowFinal.length > 0 && (
          <div className="relative w-full aspect-[4/3] bg-white rounded mb-6 border flex items-center justify-center">
            {/* Flecha izquierda */}
            {imagesToShowFinal.length > 1 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-100 hover:bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200"
                onClick={e => { e.stopPropagation(); setSelectedImg((selectedImg - 1 + imagesToShowFinal.length) % imagesToShowFinal.length); }}
                aria-label="Anterior"
              >
                <span className="text-xl leading-none">&#8592;</span>
              </button>
            )}
            <img
              src={imagesToShowFinal[selectedImg]}
              alt={`Imagen ${selectedImg + 1}`}
              className={`w-full h-full object-cover mx-auto transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
              style={{ borderRadius: 'inherit' }}
              onLoad={() => setShow(true)}
              onTransitionEnd={() => setShow(true)}
              onAnimationEnd={() => setShow(true)}
            />
            {/* Flecha derecha */}
            {imagesToShowFinal.length > 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 hover:bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200"
                onClick={e => { e.stopPropagation(); setSelectedImg((selectedImg + 1) % imagesToShowFinal.length); }}
                aria-label="Siguiente"
              >
                <span className="text-xl leading-none">&#8594;</span>
              </button>
            )}
          </div>
        )}
        {/* Miniaturas */}
        {imagesToShowFinal.length > 1 && (
          <div className="flex gap-2 justify-center mb-6">
            {imagesToShowFinal.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className={`w-14 h-14 object-cover rounded border cursor-pointer transition-all duration-150 ${selectedImg === idx ? 'ring-2 ring-green-600 scale-110' : 'opacity-70 hover:opacity-100'}`}
                onClick={e => { e.stopPropagation(); setSelectedImg(idx); }}
              />
            ))}
          </div>
        )}
        <div className="space-y-3 text-lg">
          <div>
            <span className="font-semibold text-gray-800 font-display text-2xl block mb-1">{plant.scientificName}</span>
          </div>
          {plant.author && (
            <div><span className="font-semibold text-gray-800">Autor:</span> <span className="text-gray-700 font-sans">{plant.author}</span></div>
          )}
          {plant.genus && (
            <div><span className="font-semibold text-gray-800">Género:</span> <span className="text-gray-700 font-sans">{plant.genus}</span></div>
          )}
          <div><span className="font-semibold text-gray-800">Familia:</span> <span className="text-gray-700 font-sans">{plant.family || 'No especificada'}</span></div>
          {commonNames.length > 0 && (
            <div><span className="font-semibold text-gray-800">Nombres comunes:</span> <span className="text-gray-700 font-sans">{commonNames.join(', ')}</span></div>
          )}
          {synonyms.length > 0 && (
            <div><span className="font-semibold text-gray-800">Sinónimos:</span> <span className="text-gray-700 font-sans">{synonyms.join(', ')}</span></div>
          )}
          {plant.vernacularNames && (
            <div><span className="font-semibold text-gray-800">Nombres en otros idiomas:</span> <span className="text-gray-700 font-sans">{Array.isArray(plant.vernacularNames) ? plant.vernacularNames.join(', ') : plant.vernacularNames}</span></div>
          )}
          {plant.description && (
            <div><span className="font-semibold text-gray-800">Descripción:</span> <span className="text-gray-700 font-sans">{plant.description}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    const { id: userId } = JSON.parse(user);
    // Obtener plantas desde la base de datos
    fetch('/api/plants')
      .then(res => res.json())
      .then(data => {
        // Filtrar solo las plantas del usuario autenticado
        setPlants(data.filter(p => p.userId === userId));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Filtrar plantas por búsqueda
  const filteredPlants = plants.filter(plant => {
    const sciName = plant.apiData.scientificName || plant.apiData.scientificNameWithoutAuthor || '';
    const family = plant.apiData.family || '';
    return (
      sciName.toLowerCase().includes(search.toLowerCase()) ||
      family.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center font-display">Biblioteca de Plantas</h1>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre científico o familia..."
            className="w-full max-w-md px-4 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-lg bg-white text-gray-900 font-sans"
          />
        </div>
        {loading ? (
          <div className="text-center text-gray-600 font-sans">Cargando plantas...</div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center text-gray-600 font-sans">
            <p className="text-lg">No hay plantas guardadas aún.</p>
            <p className="mt-2">Ve a la página de <a href="/plantas" className="text-green-600 hover:text-green-800 underline">identificación</a> para agregar plantas a tu biblioteca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[2000px] mx-auto">
            {filteredPlants.map((plant, index) => (
              <PlantCard
                key={plant.id || index}
                plant={{
                  scientificName: plant.apiData.scientificName || plant.apiData.scientificNameWithoutAuthor || '',
                  family: plant.apiData.family || '',
                  imageUrl: Array.isArray(plant.imageUrl) ? plant.imageUrl : (
                    typeof plant.imageUrl === 'string' ? (() => { try { return JSON.parse(plant.imageUrl); } catch { return []; } })() : []
                  ),
                  score: plant.apiData.score || ''
                }}
                onClick={() => setSelectedPlant({
                  scientificName: plant.apiData.scientificName || plant.apiData.scientificNameWithoutAuthor || '',
                  family: plant.apiData.family || '',
                  imageUrl: Array.isArray(plant.imageUrl) ? plant.imageUrl : (
                    typeof plant.imageUrl === 'string' ? (() => { try { return JSON.parse(plant.imageUrl); } catch { return []; } })() : []
                  ),
                  score: plant.apiData.score || '',
                  ...plant.apiData // por si hay más datos
                })}
              />
            ))}
          </div>
        )}
        <PlantModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      </main>
    </div>
  );
}
