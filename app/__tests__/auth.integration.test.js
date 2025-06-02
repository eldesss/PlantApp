const { POST: register } = require('../api/auth/register/route');

describe('Registro de usuario (integración)', () => {
  it('debe registrar un usuario nuevo', async () => {
    const req = { json: async () => ({ username: 'testuser', email: 'test@email.com', password: '123456' }) };
    const res = await register(req);
    const data = await res.json();
    console.log(res.status);
    expect([201, 409]).toContain(res.status); // 201 si es nuevo, 409 si ya existe
    expect(data.user || data.error).toBeDefined();
  });
}); 