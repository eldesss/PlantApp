const API_KEY = process.env.PLANTNET_API_KEY;

export async function POST(req) {
  try {
    const formData = await req.formData();

    const res = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${API_KEY}`, {
      method: 'POST',
      body: formData
      // No headers manuales, el navegador pone el Content-Type de FormData automáticamente
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error en la identificación de planta:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar la imagen' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
