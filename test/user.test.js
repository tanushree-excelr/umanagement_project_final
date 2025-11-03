const request = require('supertest');
const app = require('../server');
const { mongoose } = require('../server');

let createdUserId;

describe('User API', () => {
  it('should create a user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Tanushree',
        email: 'tanushree@example.com',
        username: 'tanushree1',
        password: '123456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdUserId = res.body._id;
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'missing@example.com' });
    expect(res.statusCode).toBe(400);
  });

  it('should fetch all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a single user by ID', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 if user not found', async () => {
    const res = await request(app).get(`/api/users/671111111111111111111111`);
    expect(res.statusCode).toBe(404);
  });

  it('should update a user name', async () => {
    const res = await request(app)
      .patch(`/api/users/${createdUserId}`)
      .send({ name: 'Updated Tanushree' });
    expect(res.statusCode).toBe(200);
  });

  it('should fail to update with invalid ID', async () => {
    const res = await request(app)
      .patch(`/api/users/invalidID`)
      .send({ name: 'Fail Update' });
    expect(res.statusCode).toBe(400);
  });

  it('should delete a user successfully', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
  });

  it('should fail to delete non-existing user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
