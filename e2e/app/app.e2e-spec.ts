import * as request from 'supertest';
import { app } from '../constants';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
