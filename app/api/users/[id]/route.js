import { prisma } from '@/lib/prisma';

export async function GET(req, context) {
  const { id } = await context.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        id: true,
        plants: {
          select: {
            id: true,
            apiData: true,
            imageUrl: true,
            createdAt: true
          }
        },
        favoritedBy: {
          select: {
            user: { select: { id: true, username: true } }
          }
        }
      }
    });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
    }
    const favoritedByUsers = user.favoritedBy.map(fav => fav.user);
    return new Response(JSON.stringify({ ...user, favoritedBy: favoritedByUsers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
