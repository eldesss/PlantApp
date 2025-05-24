import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    });

    return NextResponse.json({ message: 'Email verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar email:', error);
    return NextResponse.json({ error: 'Error al verificar email' }, { status: 500 });
  }
} 