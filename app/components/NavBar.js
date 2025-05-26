"use client";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import Link from "next/link";
import { FaLeaf, FaSignOutAlt } from 'react-icons/fa';

export default function NavBar() {
  const router = useRouter();
  const { user, logout, loading } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link href="/home" className="flex items-center gap-2 text-2xl font-extrabold tracking-wide hover:text-green-200 transition-colors">
            <FaLeaf className="text-3xl" />
            Virtual Garden
          </Link>
          {!loading && user?.username && (
            <span className="ml-4 flex items-center gap-2 bg-green-800/60 px-3 py-1 rounded-full text-green-100 font-semibold text-base shadow-inner">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-900 text-white font-bold uppercase">
                {user.username.charAt(0)}
              </span>
              {user.username}
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <Link href="/plants" className="relative group font-medium">
            <span className="hover:text-green-200 transition-colors">Mis plantas</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link href="/garden" className="relative group font-medium">
            <span className="hover:text-green-200 transition-colors">Jardín</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link href="/identify" className="relative group font-medium">
            <span className="hover:text-green-200 transition-colors">Identificar</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <button
            className="ml-6 flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-lg" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 