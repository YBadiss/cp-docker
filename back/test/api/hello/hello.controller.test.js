'use strict';

const request = require('supertest');
const { expect } = require('chai');

const app = require('../../../src/app');

describe('api/rides', () => {
  let application;

  before(async () => {
    application = await app.start();
  });

  after(async () => {
    await app.stop();
  });

  describe('GET /api/hello/:name/:id', () => {
    it('should return a not found error if name is missing', async () => {
      const { body, status } = await request(application).get('/api/hello//34');
      expect({ body, status }).to.deep.equal({ body: {}, status: 404 });
    });
    it('should return a not found error if id is missing', async () => {
      const { body, status } = await request(application).get('/api/hello/robert/');
      expect({ body, status }).to.deep.equal({ body: {}, status: 404 });
    });
    it('should return a welcome message', async () => {
      const { body, status } = await request(application).get('/api/hello/robert/34');
      expect({ body, status }).to.deep.equal({
        body: { message: 'Welcome robert (id: 34)!' },
        status: 200
      });
    });
  });
});
