"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import Link from "next/link";
import { FaLeaf, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function NavBar() {
  const router = useRouter();
  const { user, logout, loading } = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto flex justify-between items-center px-4 relative">
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
        {/* Botón hamburguesa */}
        <button
          className="sm:hidden ml-4 z-20"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          {open ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
        {/* Enlaces */}
        <div
          className={`flex-col sm:flex-row sm:flex gap-6 items-center
            ${open ? "flex" : "hidden"}
            sm:!flex absolute sm:static top-full left-0 w-full sm:w-auto bg-green-700 sm:bg-transparent shadow-lg sm:shadow-none p-6 sm:p-0 transition-all duration-300 z-10`}
        >
          <Link href="/plants" className="relative group font-medium w-full sm:w-auto text-center py-2 sm:py-0">
            <span className="hover:text-green-200 transition-colors">Mis plantas</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link href="/garden" className="relative group font-medium w-full sm:w-auto text-center py-2 sm:py-0">
            <span className="hover:text-green-200 transition-colors">Jardín</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link href="/identify" className="relative group font-medium w-full sm:w-auto text-center py-2 sm:py-0">
            <span className="hover:text-green-200 transition-colors">Identificar</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link href="/users" className="relative group font-medium w-full sm:w-auto text-center py-2 sm:py-0">
            <span className="hover:text-green-200 transition-colors">Descubrir</span>
            <span className="block h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <button
            className="ml-0 sm:ml-6 flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 w-full sm:w-auto justify-center mt-4 sm:mt-0"
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