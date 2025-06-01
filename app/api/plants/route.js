import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

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

  // Optimizar imágenes si llegan como base64
  let optimizedImages = imageUrl;
  if (Array.isArray(imageUrl)) {
    optimizedImages = await Promise.all(
      imageUrl.map(async (imgBase64) => {
        try {
          const base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const outputBuffer = await sharp(buffer)
            .resize({ width: 600 })
            .jpeg({ quality: 70 })
            .toBuffer();
          return `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;
        } catch (e) {
          // Si falla, devuelve la original
          return imgBase64;
        }
      })
    );
  }

  const planta = await prisma.plant.create({
    data: {
      userId,
      apiData,
      imageUrl: optimizedImages,
    },
  });

  return NextResponse.json(planta);
} 