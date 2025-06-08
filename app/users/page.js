"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DotLoader } from "react-spinners";
import SearchBar from "../components/SearchBar";
import FavoriteButton from "@/components/FavoriteButton";
import { motion } from 'framer-motion';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [favoriteStates, setFavoriteStates] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      try {
        setCurrentUserId(JSON.parse(user).id);
      } catch {}
    }
  }, []);

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

  useEffect(() => {
    if (!currentUserId) return;
    const favs = {};
    usuarios.forEach(u => {
      favs[u.id] = u.favoritedBy?.some(f => f.id === currentUserId) || false;
    });
    setFavoriteStates(favs);
  }, [usuarios, currentUserId]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center py-10">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold text-green-800 mb-8 font-leafy"
      >
        Descubrir
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex justify-center mb-8 w-100"
      >
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar usuario..."
        />
      </motion.div>
      {loading && (
        <div className="flex justify-center items-center h-32mt-70 m-60">
          <DotLoader color="#22c55e" size={60} />
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl justify-center"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.12 }
          }
        }}
      >
        {usuarios
          .filter(usuario => usuario.username.toLowerCase().includes(search.toLowerCase()))
          .filter(usuario => usuario.id !== currentUserId)
          .sort((a, b) => {
            const favA = a.favoritedBy?.length || 0;
            const favB = b.favoritedBy?.length || 0;
            if (favB !== favA) return favB - favA;
            const plantasA = a.plants?.length || 0;
            const plantasB = b.plants?.length || 0;
            return plantasB - plantasA;
          }).length === 0 && !loading && !error && (
            <div className="col-span-full text-center text-gray-500 text-lg mt-8">No hay usuarios para mostrar.</div>
        )}
        {usuarios
          .filter(usuario => usuario.username.toLowerCase().includes(search.toLowerCase()))
          .filter(usuario => usuario.id !== currentUserId)
          .sort((a, b) => {
            const favA = a.favoritedBy?.length || 0;
            const favB = b.favoritedBy?.length || 0;
            if (favB !== favA) return favB - favA;
            const plantasA = a.plants?.length || 0;
            const plantasB = b.plants?.length || 0;
            return plantasB - plantasA;
          })
          .map((usuario) => (
          <motion.div
            key={usuario.username}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 30 },
              show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
            }}
            whileHover={{
              scale: 1.10,
              y: -10,
              boxShadow: '0 12px 40px 0 rgba(34,197,94,0.18)',
              borderColor: '#22c55e'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 123123 }}            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-gray-200 w-full transition-all duration-300 cursor-pointer relative"
            onClick={() => router.push(`/users/${usuario.id}`)}
          >
            <span className="text-2xl font-extrabold text-green-700 mb-4 text-center tracking-wide capitalize drop-shadow-sm">{usuario.username}</span>
            <div className="flex gap-3 bg-green-50 rounded-xl p-3 min-h-[5.5rem] items-center justify-center w-full mb-2 relative">
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
              <FavoriteButton
                userId={usuario.id}
                favoritedBy={usuario.favoritedBy}
                currentUserId={currentUserId}
                className="absolute bottom-1 right-1"
                onChange={async () => {
                  const resUsers = await fetch('/api/users');
                  if (resUsers.ok) {
                    const data = await resUsers.json();
                    setUsuarios(data);
                  }
                }}
              />
            </div>
            <span className="text-sm text-green-800 font-medium mt-2">{usuario.plants ? usuario.plants.length : 0} planta{usuario.plants && usuario.plants.length === 1 ? '' : 's'}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
