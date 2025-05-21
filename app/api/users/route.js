import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(req) {
  const { username, email, password } = await req.json();
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }
  // Comprobar si ya existe el usuario
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });
  if (existing) {
    return NextResponse.json({ error: 'El usuario o email ya existe' }, { status: 409 });
  }
  // Crear usuario
  const user = await prisma.user.create({
    data: { username, email, password },
  });
  return NextResponse.json({ id: user.id, username: user.username, email: user.email });
} 