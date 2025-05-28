// backend/routes/remixes.test.js
const request = require('supertest');
const app     = require('../server');

describe('Remix API', () => {
  let firstId;

  beforeAll(async () => {
    const res = await request(app).get('/api/remixes');
    if (res.status === 200 && Array.isArray(res.body) && res.body.length > 0) {
      firstId = res.body[0].id;
    }
  });

  test('GET  /api/remixes → array', async () => {
    const res = await request(app).get('/api/remixes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET  /api/remixes/:id → object or 404', async () => {
    if (!firstId) return;
    const res = await request(app).get(`/api/remixes/${firstId}`);
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('tiktok_id');
      expect(res.body).toHaveProperty('title');
    }
  });

  test('GET  /api/remixes/:id/ocr → array', async () => {
    if (!firstId) return;
    const res = await request(app).get(`/api/remixes/${firstId}/ocr`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET  /api/remixes/:id/stt → array', async () => {
    if (!firstId) return;
    const res = await request(app).get(`/api/remixes/${firstId}/stt`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
