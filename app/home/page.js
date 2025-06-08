'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaLeaf, FaSearch, FaBook, FaSeedling, FaCamera, FaFolderOpen, FaMap, FaGlobeAmericas } from 'react-icons/fa';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-7xl md:text-[10rem] font-vine text-fill-green text-outline mb-4"
        >
          VIRTUAL GARDEN
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Identifica plantas, crea tu biblioteca personal y diseña tu jardín ideal con nuestra aplicación inteligente.
        </motion.p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto"
        >
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
            <Link href="/identify" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors w-full sm:w-auto">
              Comenzar Ahora
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
            <Link href="/plants" className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors w-full sm:w-auto">
              Explorar Plantas
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="bg-white py-12 sm:py-16"
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl font-bold text-green-800 mb-8 sm:mb-12 text-center font-display"
          >
            Características Principales
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
          >
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="text-center p-6">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-green-600 text-2xl" />
              </motion.div>
              <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-green-800 mb-2">Identificación</motion.h3>
              <motion.p variants={fadeInUp} className="text-gray-600">Identifica plantas fácilmente con nuestra tecnología de reconocimiento de imágenes.</motion.p>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="text-center p-6">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-green-600 text-2xl" />
              </motion.div>
              <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-green-800 mb-2">Biblioteca Personal</motion.h3>
              <motion.p variants={fadeInUp} className="text-gray-600">Guarda y organiza tus plantas favoritas en tu biblioteca personal.</motion.p>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="text-center p-6">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSeedling className="text-green-600 text-2xl" />
              </motion.div>
              <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-green-800 mb-2">Diseño de Jardín</motion.h3>
              <motion.p variants={fadeInUp} className="text-gray-600">Crea y visualiza tu jardín ideal con nuestras herramientas de diseño.</motion.p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Sección de Guía de Uso */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="bg-green-100 py-12 sm:py-16"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl font-bold text-green-800 mb-8 text-center font-display"
          >
            Funcionamiento
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-8 md:gap-6"
          >
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }} className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col md:flex-row items-center md:items-start md:w-full transition-all duration-300">
              <Link href="/identify" className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 cursor-pointer group" passHref>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <motion.span whileHover={{ scale: 1.25, rotate: -10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center justify-center w-10 h-10">
                    <FaCamera className="text-green-600 text-2xl" />
                  </motion.span>
                </div>
              </Link>
              <div className="text-left">
                <motion.h3 variants={fadeInUp} className="font-semibold text-green-700 mb-1">1. Identifica la planta</motion.h3>
                <motion.p variants={fadeInUp} className="text-gray-700 text-sm">Para reconocer una planta, deberás subir al menos <b>3 imágenes</b> de diferentes ángulos (hojas, flor, tallo, etc). Esto mejora la precisión del reconocimiento y te permitirá obtener resultados más fiables.</motion.p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }} className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col md:flex-row items-center md:items-start md:w-full transition-all duration-300">
              <Link href="/plants" className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 cursor-pointer group" passHref>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <motion.span whileHover={{ scale: 1.25, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center justify-center w-10 h-10">
                    <FaFolderOpen className="text-green-600 text-2xl" />
                  </motion.span>
                </div>
              </Link>
              <div className="text-left">
                <motion.h3 variants={fadeInUp} className="font-semibold text-green-700 mb-1">2. Colecciona plantas</motion.h3>
                <motion.p variants={fadeInUp} className="text-gray-700 text-sm">En el apartado <b>"Mis plantas"</b> tendrás acceso a toda la información, fotos y detalles de las plantas que hayas identificado. Podrás ver su nombre científic, familia, procentaje de acierto y la fecha de identificación.</motion.p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }} className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col md:flex-row items-center md:items-start md:w-full transition-all duration-300">
              <Link href="/garden" className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 cursor-pointer group" passHref>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <motion.span whileHover={{ scale: 1.25, rotate: -10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center justify-center w-10 h-10">
                    <FaMap className="text-green-600 text-2xl" />
                  </motion.span>
                </div>
              </Link>
              <div className="text-left">
                <motion.h3 variants={fadeInUp} className="font-semibold text-green-700 mb-1">3. Crea jardines</motion.h3>
                <motion.p variants={fadeInUp} className="text-gray-700 text-sm">En la sección de <b>"Jardín"</b> podrás diseñar tu propio espacio verde. Selecciona las plantas que quieras utilizar desde "Mis plantas", organiza su disposición y visualiza cómo quedará tu jardín antes de llevarlo a la realidad.</motion.p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }} className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col md:flex-row items-center md:items-start md:w-full transition-all duration-300">
              <Link href="/users" className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 cursor-pointer group" passHref>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <motion.span whileHover={{ scale: 1.25, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center justify-center w-10 h-10">
                    <FaGlobeAmericas className="text-green-600 text-2xl" />
                  </motion.span>
                </div>
              </Link>
              <div className="text-left">
                <motion.h3 variants={fadeInUp} className="font-semibold text-green-700 mb-1">4. ¡Descubre!</motion.h3>
                <motion.p variants={fadeInUp} className="text-gray-700 text-sm">En <b>"Descubrir"</b> podrás explorar las plantas identificadas por otros usuarios, ver fotos, aprender curiosidades y ampliar tus conocimientos sobre el mundo vegetal. ¡Inspírate y conecta con la comunidad!</motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
} 