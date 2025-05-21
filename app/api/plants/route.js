import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtener todas las plantas del usuario autenticado
export async function GET(req) {
  // Aquí deberías obtener el usuario autenticado con NextAuth
  // Por ahora, solo devolvemos todas las plantas
  const plantas = await prisma.plant.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(plantas);
}

// Guardar una nueva planta
export async function POST(req) {
  const body = await req.json();
  console.log('Body recibido en API:', body);
  // body debe incluir: userId, apiData, imageUrl
  const { userId, apiData, imageUrl } = body;
  if (!userId || !apiData) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }

  const planta = await prisma.plant.create({
    data: {
      userId,
      apiData,
      imageUrl,
    },
  });

  return NextResponse.json(planta);
} 