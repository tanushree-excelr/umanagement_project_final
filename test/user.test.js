const request = require('supertest');
const app = require('../server');
const { mongoose } = require('../server');

let createdUserId;

describe('User API', () => {
  
  // POST - Create user (positive case)
  it('should create a user successfully with all fields', async () => {
    const newUser = {
      name: 'Tanushree',
      email: 'tanushree@example.com',
      username: 'tanushree1',
      password: '123456'
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(typeof res.body).toBe('object');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('username');
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
    expect(res.body.username).toBe(newUser.username);
    createdUserId = res.body._id;
  });

  // POST - Negative case (missing fields)
  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'missing@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // POST - Negative case (invalid email format)
  it('should fail if email format is invalid', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Invalid Email',
        email: 'notAnEmail',
        username: 'wrongUser',
        password: '123456'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // GET - Fetch all users
  it('should fetch all users and validate response fields', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const user = res.body[0];
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
    }
  });

  // GET - Fetch single user by ID
  it('should fetch a single user by ID with all fields', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdUserId);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('username');
  });

  // GET - Negative case (user not found)
  it('should return 404 if user not found', async () => {
    const res = await request(app).get(`/api/users/671111111111111111111111`);
    expect(res.statusCode).toBe(404);
  });

  // PATCH - Update a user name
  it('should update a user name successfully', async () => {
    const res = await request(app)
      .patch(`/api/users/${createdUserId}`)
      .send({ name: 'Updated Tanushree' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Tanushree');
  });

  // PATCH - Negative case (invalid ID)
  it('should fail to update with invalid ID', async () => {
    const res = await request(app)
      .patch(`/api/users/invalidID`)
      .send({ name: 'Fail Update' });
    expect(res.statusCode).toBe(400);
  });

  // DELETE - Delete a user
  it('should delete a user successfully', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
  });

  // DELETE - Negative case (non-existing user)
  it('should fail to delete non-existing user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
