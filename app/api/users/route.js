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
          select: {
            user: { select: { id: true, username: true } }
          }
        }
      }
    });
    // Mapear favoritedBy para devolver solo los usuarios únicos
    const usuariosConFavoritos = usuarios.map(u => ({
      ...u,
      favoritedBy: u.favoritedBy.map(fav => fav.user)
    }));
    return new Response(JSON.stringify(usuariosConFavoritos), {
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
