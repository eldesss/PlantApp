import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const { username, email, password } = await req.json();
  if ((!username && !email) || !password) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        username ? { username } : undefined,
        email ? { email } : undefined
      ].filter(Boolean),
      password
    }
  });
  if (!user) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }
  return NextResponse.json({ id: user.id, username: user.username, email: user.email });
} 