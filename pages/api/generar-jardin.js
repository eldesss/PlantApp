export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Log para depuración
  console.log('Body recibido:', req.body);

  // Parsear el body si viene como string o como objeto
  let nombres, estilo;
  try {
    if (typeof req.body === 'string') {
      const body = JSON.parse(req.body);
      nombres = body.nombres;
      estilo = body.estilo;
    } else {
      nombres = req.body.nombres;
      estilo = req.body.estilo;
    }
  } catch (e) {
    console.error('Body inválido:', e);
    return res.status(400).json({ error: 'Body inválido' });
  }

  const HUGGING_FACE_API = process.env.HUGGING_FACE_API;
  const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
  try {
    if (!nombres || !Array.isArray(nombres) || nombres.length === 0) {
      return res.status(400).json({ error: 'No se recibieron nombres de plantas' });
    }
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
      const contentType = response.headers.get('content-type') || '';
      const errorText = await response.text();
      // Si la respuesta es HTML, es un error de Hugging Face
      if (contentType.includes('text/html')) {
        console.error('Error Hugging Face (HTML):', errorText);
        return res.status(503).json({ error: 'Hugging Face no está disponible. Intenta más tarde.' });
      }
      console.error('Error Hugging Face:', errorText);
      return res.status(500).json({ error: errorText || 'Error desconocido en Hugging Face' });
    }
    // Validar que la respuesta sea una imagen
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      console.error('Respuesta inesperada de Hugging Face. Content-Type:', contentType);
      return res.status(502).json({ error: 'La respuesta de Hugging Face no es una imagen válida.' });
    }
    const arrayBuffer = await response.arrayBuffer();
    const extension = contentType.split('/')[1] || 'png';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return res.status(200).json({ image: `data:image/${extension};base64,${base64}` });
  } catch (e) {
    console.error('Error general:', e);
    return res.status(500).json({ error: e.message || e.toString() });
  }
} 