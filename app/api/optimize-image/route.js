import sharp from 'sharp';

export const maxRequestBodySize = '10mb';

export async function POST(req) {
  try {
    const data = await req.json();
    let buffer;

    if (data.imageUrl) {
      // Descargar la imagen desde la URL
      const response = await fetch(data.imageUrl);
      buffer = Buffer.from(await response.arrayBuffer());
    } else if (data.base64) {
      // Recibir imagen en base64
      buffer = Buffer.from(data.base64, 'base64');
    } else {
      return new Response(JSON.stringify({ error: 'No se proporcionó imagen' }), { status: 400 });
    }

    // Optimizar la imagen
    const optimizedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();

    // Devolver la imagen optimizada en base64
    return new Response(JSON.stringify({
      optimized: optimizedBuffer.toString('base64')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 