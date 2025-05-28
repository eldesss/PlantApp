"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlantCard from "@/components/plants/PlantCard";
import { DotLoader } from "react-spinners";

export default function UsuarioDetallePage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }
    }
    if (id) fetchUsuario();
  }, [id]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10">
      {loading && (
        <div className="flex justify-center items-center h-32 mt-70">
          <DotLoader color="#22c55e" size={60} />
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && usuario && (
        <>
          <h1 className="text-4xl font-extrabold text-green-800 mb-10 text-center drop-shadow-sm capitalize">
            {usuario.username}
          </h1>
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
                  />
                </div>
              ))
            ) : (
              <span className="text-gray-500">Este usuario no tiene plantas.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
} 