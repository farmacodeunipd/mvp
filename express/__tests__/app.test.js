const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('responds with "Server is running!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running!');
  });
});

describe('GET /users', () => {
  it('responds with JSON containing a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ cod_cli: expect.any(Number), rag_soc: expect.any(String) })
    ]));
  });
});

// Add more test cases for other endpoints as needed