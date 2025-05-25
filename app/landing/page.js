'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaLeaf, FaSearch, FaBook, FaSeedling } from 'react-icons/fa';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Navegación */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaLeaf className="text-green-600 text-2xl" />
              <span className="text-xl font-bold text-green-800 font-display">PlantApp</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-green-700 hover:text-green-900 font-medium">Iniciar Sesión</Link>
              <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Registrarse
              </Link>
            </div>
            <button 
              className="md:hidden text-green-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <Link href="/" className="block text-green-700 hover:text-green-900 font-medium">Iniciar Sesión</Link>
              <Link href="/register" className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-6 font-display">
          Descubre y Cuida tus Plantas
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Identifica plantas, crea tu biblioteca personal y diseña tu jardín ideal con nuestra aplicación inteligente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Comenzar Ahora
          </Link>
          <Link href="/plantas" className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors">
            Explorar Plantas
          </Link>
        </div>
      </section>

      {/* Características */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-12 text-center font-display">
            Características Principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Identificación</h3>
              <p className="text-gray-600">Identifica plantas fácilmente con nuestra tecnología de reconocimiento de imágenes.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Biblioteca Personal</h3>
              <p className="text-gray-600">Guarda y organiza tus plantas favoritas en tu biblioteca personal.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSeedling className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Diseño de Jardín</h3>
              <p className="text-gray-600">Crea y visualiza tu jardín ideal con nuestras herramientas de diseño.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Cuidado de Plantas</h3>
              <p className="text-gray-600">Recibe consejos personalizados para el cuidado de tus plantas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 font-display">¿Listo para comenzar tu viaje botánico?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de amantes de las plantas y comienza a explorar el mundo de la botánica.
          </p>
          <Link href="/register" className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors">
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaLeaf className="text-2xl" />
              <span className="text-xl font-bold font-display">PlantApp</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="hover:text-green-200">Acerca de</Link>
              <Link href="/contact" className="hover:text-green-200">Contacto</Link>
              <Link href="/privacy" className="hover:text-green-200">Privacidad</Link>
              <Link href="/terms" className="hover:text-green-200">Términos</Link>
            </div>
          </div>
          <div className="text-center mt-8 text-green-200">
            <p>&copy; {new Date().getFullYear()} PlantApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 