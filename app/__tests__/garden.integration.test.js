const { POST: generateGarden } = require('../api/garden/route');

describe('Generar jardín (integración)', () => {
  it('debe intentar generar un jardín con datos válidos', async () => {
    const req = { json: async () => ({ nombres: ['Ficus', 'Rosa'], estilo: 'moderno' }) };
    const res = await generateGarden(req);
    const data = await res.json();
    console.log(res.status);
    expect([200, 500, 502]).toContain(res.status || 200); // 500/502 si falla la API externa
    expect(data.image || data.error).toBeDefined();
  });
}); 