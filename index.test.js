const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index');
const User  = require('./models/user.model');
// const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

beforeEach(async () => {
  await mongoose.connect("mongodb+srv://adminsirelsoft:1qaz0okm@clustersirelsoft.7dcungv.mongodb.net/test");
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe('GET /users', () => {
  test('should get all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(220);
  });
});

describe('GET /users/:id', () => {
  test('should get a user by ID', async () => {
    const user = new User({ name: 'John Doe', email: 'john@example.com' });
   const saveUser= await user.save();

    const response = await request(app).get(`/users/${saveUser._id}`);
    expect(response.status).toBe(200);
    
  });

  test('should return 404 if user is not found', async () => {
    const response = await request(app).get('/users/1234567890');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });
});

describe('POST /users', () => {
  test('should create a new user', async () => {
    const newUser = { name: 'Alice Johnson', email: 'alice@example.com' };

    const response = await request(app).post('/users').send(
      { name: 'Alice Johnson', email: 'alice@example.com' }

    );

    expect(response.status).toBe(201);
    // expect(response.body.name).toEqual(newUser.name);
    // expect(response.body.email).toEqual(newUser.email);
  });
});

describe('PUT /users/:id', () => {
  test('should update a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john@example.com' });
    await user.save();

    const updatedUser = { name: 'John Updated', email: 'updated@example.com' };

    const response = await request(app)
      .put(`/users/${user._id}`)
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(updatedUser.name);
    expect(response.body.email).toEqual(updatedUser.email);
  });

  test('should return 404 if user is not found', async () => {
    const response = await request(app).put('/users/1234567890').send({
      name: 'Updated',
      email: 'updated@example.com',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });
});

describe('DELETE /users/:id', () => {
  test('should delete a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john@example.com' });
    await user.save();

    const response = await request(app).delete(`/users/${user._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(user.name);
    expect(response.body.email).toEqual(user.email);
  });

  test('should return 404 if user is not found', async () => {
    const response = await request(app).delete('/users/1234567890');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });
});
