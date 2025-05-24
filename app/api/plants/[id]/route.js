import { prisma } from '@/lib/prisma';

export async function DELETE(req, { params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });
  }
  try {
    await prisma.plant.delete({ where: { id: Number(id) } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'No se pudo eliminar la planta' }), { status: 500 });
  }
} 