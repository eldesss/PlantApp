import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
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
      return new Response(JSON.stringify({ error: 'El usuario ya existe' }), { status: 409 });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con contraseña encriptada
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });

    return new Response(JSON.stringify({ user }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Error en el registro' }), { status: 500 });
  }
} 