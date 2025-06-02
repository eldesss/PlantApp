const { POST: register } = require('../api/auth/register/route');

describe('Registro de usuario (unitario)', () => {
  it('debe devolver error si faltan datos', async () => {
    const req = { json: async () => ({ username: '', email: '', password: '' }) };
    const res = await register(req);
    const data = await res.json();
    console.log(res.status);
    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });
}); 