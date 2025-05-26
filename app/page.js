"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (isRegister) {
      // Registro
      if (!username || !email || !password) {
        setError('Completa todos los campos');
        return;
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }
      // Registro exitoso, redirigir a login
      setIsRegister(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setSuccess('Usuario registrado correctamente.');
    } else {
      // Login
      if ((!username && !email) || !password) {
        setError('Completa todos los campos');
        return;
      }
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Usuario o contraseña incorrectos');
        return;
      }
      // Usar el contexto para el login
      login(data);
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl border-2 border-green-200 w-full max-w-sm relative overflow-hidden animate-fade-in">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-600 rounded-full blur-2xl opacity-30 z-0" />
        <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-center font-display tracking-wide drop-shadow-lg">
          {isRegister ? 'Registro' : 'Iniciar Sesión'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5 z-10 relative">
          {isRegister && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-lg text-gray-800 placeholder-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center animate-pulse">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center animate-fade-in">{success}</div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 tracking-wide"
          >
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 text-center z-10 relative">
          <button
            className="text-green-700 hover:underline font-semibold transition"
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
} 