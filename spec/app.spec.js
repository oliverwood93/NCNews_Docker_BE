process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);

describe('nc_news database', () => {
  describe('/api', () => {
    describe('/topics', () => {
      it('GET request: responds with a status 200', () => request.get('/api/topics').expect(200));
    });
  });
});
