"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

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
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-green-800 mb-4 text-center">
          {isRegister ? 'Registro' : 'Iniciar Sesión'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-800 placeholder-gray-600 bg-gray-100"
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-800 placeholder-gray-600 bg-gray-100"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-800 placeholder-gray-600 bg-gray-100"
          />
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm">{success}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-green-700 hover:underline"
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
} 