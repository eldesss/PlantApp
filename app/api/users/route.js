import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        username: true,
        id: true,
        plants: {
          select: {
            id: true,
            imageUrl: true,
            apiData: true
          }
        },
        favoritedBy: {
          select: { id: true }
        }
      }
    });
    return new Response(JSON.stringify(usuarios), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener usuarios' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
