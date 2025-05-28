"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DotLoader } from "react-spinners";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Usuarios registrados</h1>
      {loading && (
        <div className="flex justify-center items-center h-32mt-70">
          <DotLoader color="#22c55e" size={60} />
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {usuarios.map((usuario) => (
          <div
            key={usuario.username}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-200 min-w-[16rem] max-w-[22rem] transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
            onClick={() => router.push(`/users/${usuario.id}`)}
          >
            <span className="text-2xl font-extrabold text-green-700 mb-4 text-center tracking-wide capitalize drop-shadow-sm">{usuario.username}</span>
            <div className="flex gap-3 bg-green-50 rounded-xl p-3 min-h-[5.5rem] items-center justify-center w-full mb-2">
              {usuario.plants && usuario.plants.length > 0 ? (
                usuario.plants.slice(0, 3).map((planta) => (
                  <div key={planta.id} className="flex flex-col items-center">
                    {planta.imageUrl && Array.isArray(planta.imageUrl) && planta.imageUrl[0] ? (
                      <img src={planta.imageUrl[0]} alt="Planta" className="w-16 h-16 object-cover rounded-lg border-2 border-green-200 shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border-2 border-gray-100">?</div>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-400">Sin plantas</span>
              )}
            </div>
            <span className="text-sm text-green-800 font-medium mt-2">{usuario.plants ? usuario.plants.length : 0} planta{usuario.plants && usuario.plants.length === 1 ? '' : 's'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
