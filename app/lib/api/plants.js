const API_KEY = process.env.PLANTNET_API_KEY;
const BASE_URL = 'https://my-api.plantnet.org/v2';

export async function identifyPlant(imageUrl) {
  try {
    const response = await fetch(`${BASE_URL}/identify/all`, {
      method: 'POST',
      headers: {
        'Api-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        images: [imageUrl],
        organs: ['flower']
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Error al identificar la planta: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}