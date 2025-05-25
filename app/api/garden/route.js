import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { nombres, estilo } = await req.json();

    if (!nombres || !Array.isArray(nombres) || nombres.length === 0) {
      return NextResponse.json({ error: 'No se recibieron nombres de plantas' }, { status: 400 });
    }

    const HUGGING_FACE_API = process.env.HUGGING_FACE_API_1;
    const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
    const prompt = `Un jardín con el estilo: ${estilo ? estilo : ''} con las siguientes plantas: ${nombres.join(', ')}.`;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Error al generar la imagen con Hugging Face' }, { status: 500 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'La respuesta de Hugging Face no es una imagen válida.' }, { status: 502 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const extension = contentType.split('/')[1] || 'png';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return NextResponse.json({ image: `data:image/${extension};base64,${base64}` });

  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error en el endpoint' }, { status: 500 });
  }
} 