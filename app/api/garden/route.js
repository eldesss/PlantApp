import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { nombres, estilo } = await req.json();
    console.log('📝 Recibida petición:', { nombres, estilo });

    if (!nombres || !Array.isArray(nombres) || nombres.length === 0) {
      console.error('❌ Error: No se recibieron nombres de plantas válidos');
      return NextResponse.json({ error: 'No se recibieron nombres de plantas' }, { status: 400 });
    }

    const HUGGING_FACE_API = process.env.HUGGING_FACE_API;
    const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
    const prompt = `Un jardín con el estilo: ${estilo ? estilo : ''} con las siguientes plantas: ${nombres.join(', ')}.`;
    console.log('🎨 Prompt generado:', prompt);

    console.log('🚀 Enviando petición a Hugging Face...');
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error en la respuesta de Hugging Face:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      return NextResponse.json({ 
        error: 'Error al generar la imagen con Hugging Face',
        details: errorData
      }, { status: 500 });
    }

    const contentType = response.headers.get('content-type') || '';
    console.log('Tipo de contenido recibido:', contentType);

    if (!contentType.startsWith('image/')) {
      const errorText = await response.text();
      console.error('Error: La respuesta no es una imagen válida', {
        contentType,
        responseText: errorText
      });
      return NextResponse.json({ 
        error: 'La respuesta de Hugging Face no es una imagen válida.',
        details: errorText
      }, { status: 502 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const extension = contentType.split('/')[1] || 'png';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    console.log('Imagen generada exitosamente, tamaño en base64:', base64.length);
    
    return NextResponse.json({ image: `data:image/${extension};base64,${base64}` });

  } catch (error) {
    console.error('Error no controlado:', error);
    return NextResponse.json({ 
      error: error.message || 'Error en el endpoint',
      stack: error.stack
    }, { status: 500 });
  }
} 