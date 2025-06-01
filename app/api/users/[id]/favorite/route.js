import { prisma } from '@/lib/prisma';

export async function POST(req, context) {
  const { id } = await context.params;
  const currentUserId = req.headers.get('x-user-id');
  if (!currentUserId) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }
  if (currentUserId === id) {
    return new Response(JSON.stringify({ error: 'No puedes marcarte a ti mismo como favorito' }), { status: 400 });
  }
  try {
    await prisma.favorite.create({
      data: {
        userId: currentUserId,
        favoritedId: id
      }
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    if (error.code === 'P2002') {
      // Ya existe el favorito, no es un error grave
      return new Response(JSON.stringify({ success: true, alreadyFavorited: true }), { status: 200 });
    }
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al añadir favorito' }), { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { id } = await context.params;
  const currentUserId = req.headers.get('x-user-id');
  if (!currentUserId) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }
  if (currentUserId === id) {
    return new Response(JSON.stringify({ error: 'No puedes quitarte a ti mismo como favorito' }), { status: 400 });
  }
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: currentUserId,
        favoritedId: id
      }
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al quitar favorito' }), { status: 500 });
  }
} 