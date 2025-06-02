const { POST: savePlant } = require('../api/plants/route');

describe('Guardar planta (unitario)', () => {
  it('debe devolver error si faltan datos obligatorios', async () => {
    const req = { json: async () => ({ userId: '', apiData: null }) };
    const res = await savePlant(req);
    const data = await res.json();
    console.log(res.status);
    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });
}); 