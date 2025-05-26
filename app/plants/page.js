'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { DotLoader } from "react-spinners";

function PlantModal({ plant, onClose, onDelete }) {
  const [show, setShow] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Lógica para el color del porcentaje
  let scoreColor = 'text-green-700';
  if (plant.score) {
    const scoreNum = parseFloat(plant.score);
    if (scoreNum < 40) scoreColor = 'text-red-600';
    else if (scoreNum < 70) scoreColor = 'text-yellow-600';
    else scoreColor = 'text-green-700';
  }

  if (!plant) return null;

  // Nombres comunes y sinónimos pueden ser array o string
  const commonNames = Array.isArray(plant.commonNames) ? plant.commonNames : (plant.commonNames ? [plant.commonNames] : []);
  const synonyms = Array.isArray(plant.synonyms) ? plant.synonyms : (plant.synonyms ? [plant.synonyms] : []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Fondo con blur y transición de opacidad */}
      <div
        className={`absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      <div
        className={`relative bg-green-50 rounded-lg shadow-2xl border border-green-200 w-full max-w-xl md:max-w-2xl lg:max-w-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-8 text-green-800 text-center">Información de la Planta</h2>
        {/* Carrusel de imágenes */}
        {imagesToShowFinal.length > 0 && (
          <div className="relative w-full aspect-[4/3] bg-white rounded mb-8 border flex items-center justify-center">
            {/* Flecha izquierda */}
            {imagesToShowFinal.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-green-100 hover:bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200"
                onClick={e => { e.stopPropagation(); setSelectedImg((selectedImg - 1 + imagesToShowFinal.length) % imagesToShowFinal.length); }}
                aria-label="Anterior"
              >
                <span className="text-xl leading-none">&#8592;</span>
              </button>
            )}
            <Image
              src={imagesToShowFinal[selectedImg]}
              alt={`Imagen ${selectedImg + 1}`}
              className={`w-full h-full object-cover mx-auto transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
              style={{ borderRadius: 'inherit' }}
              onLoad={() => setShow(true)}
              onTransitionEnd={() => setShow(true)}
              onAnimationEnd={() => setShow(true)}
              width={800}
              height={600}
            />
            {/* Flecha derecha */}
            {imagesToShowFinal.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-100 hover:bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200"
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
          <div className="flex gap-4 justify-center mb-8 mt-2">
            {imagesToShowFinal.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className={`w-14 h-14 object-cover rounded border cursor-pointer transition-all duration-150 ${selectedImg === idx ? 'ring-2 ring-green-600 scale-110' : 'opacity-70 hover:opacity-100'}`}
                onClick={e => { e.stopPropagation(); setSelectedImg(idx); }}
                width={56}
                height={56}
              />
            ))}
          </div>
        )}
        <div className="space-y-3 text-lg pb-16">
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
          {plant.score && <div><span className="font-semibold text-gray-800">Identificación:</span> <span className={`${scoreColor} font-bold`}>{plant.score}%</span></div>}
          {plant.createdAt && <div><span className="font-semibold text-gray-800">Añadido:</span> <span className="text-gray-700 font-sans">{new Date(plant.createdAt).toLocaleDateString()}</span></div>}
        </div>
        <div className="absolute right-8 bottom-8">
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
            title="Eliminar planta"
            onClick={e => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
          >
            <FaTrash /> Eliminar planta
          </button>
        </div>
        {/* Confirmación personalizada para eliminar */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
              <p className="mb-4 text-lg text-gray-800 text-center">¿Seguro que quieres eliminar esta planta?</p>
              <div className="flex gap-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={async () => {
                    setShowDeleteConfirm(false);
                    await onDelete && onDelete();
                    onClose();
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
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
  const [checkedPlants, setCheckedPlants] = useState([]);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      router.push('/');
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

  useEffect(() => {
    const checked = localStorage.getItem('checkedPlants');
    if (checked) {
      setCheckedPlants(JSON.parse(checked));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checkedPlants', JSON.stringify(checkedPlants));
  }, [checkedPlants]);

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
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center font-display font-leafy">Biblioteca de Plantas</h1>
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">
              <FaSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre científico o familia..."
              className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-lg bg-white text-gray-900 font-sans"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full mt-64">
            <DotLoader color="#16a34a" size={60} />
          </div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center text-gray-600 font-sans">
            <p className="text-lg mt-56">No hay plantas guardadas aún.</p>
            <p className="mt-2">Ve a la página de <Link href="/identify" className="text-green-600 hover:text-green-800 underline">identificación</Link> para agregar plantas a tu biblioteca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[2000px] mx-auto">
            {filteredPlants.map((plant, index) => {
              const sciName = plant.apiData.scientificName || plant.apiData.scientificNameWithoutAuthor || '';
              const family = plant.apiData.family || '';
              const imageUrl = Array.isArray(plant.imageUrl) ? plant.imageUrl : (
                typeof plant.imageUrl === 'string' ? (() => { try { return JSON.parse(plant.imageUrl); } catch { return []; } })() : []
              );
              const isChecked = checkedPlants.includes(sciName);
              const score = plant.apiData.score ? (typeof plant.apiData.score === 'number' ? (plant.apiData.score * 100).toFixed(1) : plant.apiData.score) : null;
              const createdAt = plant.createdAt ? new Date(plant.createdAt) : null;
              return (
                <div
                  key={plant.id || index}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                  onClick={e => {
                    if (e.target.closest('button')) return;
                    setSelectedPlant({
                      scientificName: sciName,
                      family,
                      imageUrl,
                      score,
                      createdAt,
                      ...plant.apiData,
                      id: plant.id
                    });
                  }}
                >
                  <button
                    className={`absolute top-2 right-2 text-2xl focus:outline-none z-10 ${isChecked ? 'text-green-600' : 'text-gray-300'}`}
                    title={isChecked ? 'Quitar de selección' : 'Seleccionar para el jardín'}
                    onClick={e => {
                      e.stopPropagation();
                      setCheckedPlants(prev =>
                        isChecked
                          ? prev.filter(name => name !== sciName)
                          : [...prev, sciName]
                      );
                    }}
                  >
                    <FaCheckCircle />
                  </button>
                  <div className="aspect-square relative">
                    {imageUrl && imageUrl.length > 0 ? (
                      <Image
                        src={imageUrl[0]}
                        alt={sciName}
                        className="w-full h-full object-cover"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-50">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 font-display">{sciName}</h3>
                    <div className="mt-2 text-sm text-gray-500 font-sans">
                      <p>Familia: {family || 'No especificada'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {selectedPlant && (
          <PlantModal
            plant={selectedPlant}
            onClose={() => setSelectedPlant(null)}
            onDelete={async () => {
              if (!selectedPlant?.id) return;
              const res = await fetch(`/api/plants/${selectedPlant.id}`, { method: 'DELETE' });
              if (res.ok) {
                setPlants(prev => prev.filter(p => p.id !== selectedPlant.id));
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
