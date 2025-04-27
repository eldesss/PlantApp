export async function POST(req) {
  const formData = await req.formData();

  const res = await fetch('https://my-api.plantnet.org/v2/identify/all?api-key=2b10rA1MmJ3mJqnhKOuqEy3EEO', {
    method: 'POST',
    body: formData
    // No headers manuales, el navegador pone el Content-Type de FormData automáticamente
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
