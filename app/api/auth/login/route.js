import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, email, password } = await req.json();
  if ((!username && !email) || !password) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }

  // Buscar usuario por username o email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        username ? { username } : undefined,
        email ? { email } : undefined
      ].filter(Boolean)
    }
  });

  // Si no existe el usuario o la contraseña no coincide
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }

  // Si todo está bien, devuelve los datos del usuario
  return NextResponse.json({ id: user.id, username: user.username, email: user.email });
} 