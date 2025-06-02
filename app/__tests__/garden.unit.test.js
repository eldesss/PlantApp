const { POST: generateGarden } = require('../api/garden/route');

describe('Generar jardín (unitario)', () => {
  it('debe devolver error si no se reciben nombres de plantas', async () => {
    const req = { json: async () => ({ nombres: [], estilo: '' }) };
    const res = await generateGarden(req);
    const data = await res.json();
    console.log(res.status);
    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });
}); 