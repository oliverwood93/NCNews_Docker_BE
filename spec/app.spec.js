process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../db/connection');
const app = require('../app');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    describe('/topics', () => {
      it('GET request: responds with a status 200', () => request.get('/api/topics').expect(200));
      it('GET request: returns an array of topic objects all containing the correct keys', () => request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).contain.keys('slug', 'description');
          expect(body.topics).to.have.length(2);
          expect(body.topics).to.be.an('array');
        }));
      it('POST request: responds with a status of 201, adds topic to db and returns added topic', () => {
        const newTopic = { slug: 'This is the slug', description: 'This is the description' };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(201)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Topic Added Successfully: This is the slug' });
          })
          .then(() => request.get('/api/topics').then(({ body }) => expect(body.topics).to.have.length(3)));
      });
    });
    describe('/articles', () => {
      it('GET request: responds with a 200 status', () => request.get('/api/articles').expect(200));
      it('GET request: returns an array of article object with the main keys', () => request.get('/api/articles').then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.contain.keys(
          'author',
          'title',
          'article_id',
          'topic',
          'created_at',
          'votes',
        );
      }));
      it('GET request: must have a comment_count key which has the correct value', () => request.get('/api/articles').then(({ body }) => {
        expect(body.articles[0]).to.contain.keys('comment_count');
        expect(+body.articles[0].comment_count).to.be.a('number');
        expect(+body.articles[3].comment_count).to.be.a('number');
      }));
    });
  });
});
