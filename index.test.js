const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index');

const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /users', () => {
  test('should get all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('GET /users/:id', () => {
  test('should get a user by ID', async () => {
    const user = new User({ name: 'John Doe', email: 'john@example.com' });
    await user.save();

    const response = await request(app).get(`/users/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(user.toJSON());
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

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(newUser.name);
    expect(response.body.email).toEqual(newUser.email);
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
