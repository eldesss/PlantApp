"use client";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function NavBar() {
  const router = useRouter();
  const { user, logout, loading } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-green-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Plant App</h1>
          {!loading && user?.username && (
            <span className="ml-4 text-green-200 font-semibold">{user.username}</span>
          )}
        </div>
        <div className="space-x-4 flex items-center">
          <a href="/" className="hover:text-green-200">Mis plantas</a>
          <a href="/jardin" className="hover:text-green-200">Jardín</a>
          <a href="/plantas" className="hover:text-green-200">Identificar</a>
          <button
            className="ml-4 bg-green-900 hover:bg-green-700 text-white px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
} 