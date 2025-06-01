'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { DotLoader } from "react-spinners";
import SearchBar from "@/components/SearchBar";
import PlantModal from '@/components/PlantModal';

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
    fetch('/api/plants')
      .then(res => res.json())
      .then(data => {
        const userPlants = data.filter(p => p.userId === userId);
        setPlants(userPlants);
        // Cargar plantas seleccionadas del localStorage
        const savedChecked = JSON.parse(localStorage.getItem('checkedPlants') || '[]');
        setCheckedPlants(savedChecked);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleCheck = (plantId, isChecked) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    const scientificName = plant.apiData.scientificName || plant.apiData.scientificNameWithoutAuthor;
    let newCheckedPlants;
    
    if (isChecked) {
      newCheckedPlants = [...checkedPlants, { id: plantId, name: scientificName }];
    } else {
      newCheckedPlants = checkedPlants.filter(plant => plant.id !== plantId);
    }
    
    setCheckedPlants(newCheckedPlants);
    localStorage.setItem('checkedPlants', JSON.stringify(newCheckedPlants));
  };

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
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center font-display font-leafy">Mis Plantas</h1>
        <div className="flex justify-center mb-8">
          <SearchBar
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre científico o familia..."
          />
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
              const isChecked = checkedPlants.some(checkedPlant => checkedPlant.id === plant.id);
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
                      handleCheck(plant.id, !isChecked);
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
              try {
                const res = await fetch(`/api/plants/${selectedPlant.id}`, {
                  method: 'DELETE'
                });
                if (res.ok) {
                  setPlants(plants.filter(p => p.id !== selectedPlant.id));
                  // Actualizar checkedPlants si la planta eliminada estaba seleccionada
                  if (checkedPlants.some(plant => plant.id === selectedPlant.id)) {
                    const newCheckedPlants = checkedPlants.filter(plant => plant.id !== selectedPlant.id);
                    setCheckedPlants(newCheckedPlants);
                    localStorage.setItem('checkedPlants', JSON.stringify(newCheckedPlants));
                  }
                }
              } catch (error) {
                console.error('Error al eliminar la planta:', error);
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
