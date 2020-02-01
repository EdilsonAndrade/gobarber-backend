import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../utils/truncate';

import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create a user password cripted', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });
    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Edilson Andrade',
        email: 'edilson.andrade@gmail.com',
        password: '123456',
      });
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to update the user name', async () => {
    // return a fake user to test;
    const fakeUser = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(fakeUser);

    const token = await request(app)
      .post('/sessions')
      .send(fakeUser);

    const response = await request(app)
      .put(`/users`)
      .set('Authorization', `Bearer ${token.body.token}`)
      .send({
        name: 'Edilson',
      });
    expect(response.body.name).toBe('Edilson');
  });
});
