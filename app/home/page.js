'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaLeaf, FaSearch, FaBook, FaSeedling } from 'react-icons/fa';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-vine text-9xl text-fill-green text-outline">
          VIRTUAL GARDEN
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Identifica plantas, crea tu biblioteca personal y diseña tu jardín ideal con nuestra aplicación inteligente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/identify" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Comenzar Ahora
          </Link>
          <Link href="/plants" className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors">
            Explorar Plantas
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-12 text-center font-display">
            Características Principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
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
          </div>
        </div>
      </section>
    </div>
  );
} 