export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Parsear el body si viene como string o como objeto
  let nombres;
  try {
    if (typeof req.body === 'string') {
      nombres = JSON.parse(req.body).nombres;
    } else {
      nombres = req.body.nombres;
    }
  } catch (e) {
    console.error('Body inválido:', e);
    return res.status(400).json({ error: 'Body inválido' });
  }

  const HUGGING_FACE_API = "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";
  try {
    if (!nombres || !Array.isArray(nombres) || nombres.length === 0) {
      return res.status(400).json({ error: 'No se recibieron nombres de plantas' });
    }
    const prompt = `A beautiful garden with the following plants: ${nombres.join(', ')}.`;
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('Error Hugging Face:', error);
      return res.status(500).json({ error: error || 'Error desconocido en Hugging Face' });
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return res.status(200).json({ image: `data:image/png;base64,${base64}` });
  } catch (e) {
    console.error('Error general:', e);
    return res.status(500).json({ error: e.message || e.toString() });
  }
} 