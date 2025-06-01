"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlantCard from "@/components/PlantCard";
import { DotLoader } from "react-spinners";
import PlantModal from "@/components/PlantModal";
import FavoriteButton from "@/components/FavoriteButton";

export default function UsuarioDetallePage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      try {
        setCurrentUserId(JSON.parse(user).id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setFavLoading(false);
      }
    }
    if (id) fetchUsuario();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center py-10">
      {loading && (
        <div className="flex justify-center items-center h-32 mt-70">
          <DotLoader color="#22c55e" size={60} />
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && usuario && (
        <>
          <h1 className="text-4xl font-extrabold text-green-800 mb-4 text-center drop-shadow-sm capitalize">
            {usuario.username}
          </h1>
          {currentUserId && usuario.id !== currentUserId && (
            <div className="flex justify-center mb-4">
              <FavoriteButton
                userId={usuario.id}
                favoritedBy={usuario.favoritedBy}
                currentUserId={currentUserId}
                loading={favLoading}
                setLoading={setFavLoading}
                onChange={async () => {
                  // Estado optimista
                  const prevIsFav = usuario.favoritedBy.some(f => f.id === currentUserId);
                  let newFavoritedBy;
                  if (prevIsFav) {
                    newFavoritedBy = usuario.favoritedBy.filter(f => f.id !== currentUserId);
                  } else {
                    newFavoritedBy = [...usuario.favoritedBy, { id: currentUserId, username: "Tú" }];
                  }
                  setUsuario({ ...usuario, favoritedBy: newFavoritedBy });
                
                  // POST/DELETE real
                  await fetch(`/api/users/${usuario.id}/favorite`, {
                    method: prevIsFav ? 'DELETE' : 'POST',
                    headers: { 'x-user-id': currentUserId }
                  });
                
                  // GET para sincronizar el estado real
                  for (let i = 0; i < 5; i++) {
                    const res = await fetch(`/api/users/${usuario.id}`);
                    if (res.ok) {
                      const data = await res.json();
                      setUsuario(data);
                      const newIsFav = data.favoritedBy.some(f => f.id === currentUserId);
                      if (newIsFav !== prevIsFav) break;
                      await new Promise(r => setTimeout(r, 200));
                    }
                  }
                  setFavLoading(false);
                }}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {usuario.plants && usuario.plants.length > 0 ? (
              usuario.plants.map((planta, idx) => (
                <div key={planta.id || idx} className="max-w-sm w-full mx-auto">
                  <PlantCard
                    plant={{
                      scientificName: planta.apiData?.scientificName || "Sin nombre",
                      family: planta.apiData?.family || "",
                      imageUrl: planta.imageUrl,
                      score: planta.apiData?.score
                    }}
                    onClick={() => setSelectedPlant({
                      scientificName: planta.apiData?.scientificName || "Sin nombre",
                      family: planta.apiData?.family || "",
                      imageUrl: planta.imageUrl
                    })}
                    showCheck={false}
                  />
                </div>
              ))
            ) : (
              <span className="text-gray-500">Este usuario no tiene plantas.</span>
            )}
          </div>
          {selectedPlant && (
            <PlantModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} showDeleteButton={false} />
          )}
        </>
      )}
    </div>
  );
} 