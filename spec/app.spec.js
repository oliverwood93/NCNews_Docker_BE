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
      it('POST request: should respond with a 201 status and return the posted object with all keys, and that the db generated id key is correct', () => {
        const newArticle = {
          title: 'Bogus News',
          body: 'blahblah, blah blah bllllllllllllllllllaaaaaaaahhhh',
          votes: 4,
          topic: 'mitch',
          author: 'butter_bridge',
        };
        return request
          .post('/api/articles')
          .send(newArticle)
          .expect(201)
          .then(({ body }) => {
            expect(body.addedArticle).contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at',
            );
            expect(body.addedArticle.article_id).to.equal(13);
          });
      });
      it('GET/QUERY: allows user to query by author', () => request
        .get('/api/articles?author=rogersop')
        .expect(200)
        .then(
          ({ body }) => expect(body.articles.every(article => article.author === 'rogersop')).to.be.true,
        ));
      it('GET/QUERY: allows user to query by topic', () => request
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(
          ({ body }) => expect(body.articles.every(article => article.topic === 'cats')).to.be.true,
        ));
      it('GET/QUERY: sorts articles by date and desc by default', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => expect(new Date(body.articles[0].created_at).getTime()).to.be.greaterThan(
          new Date(body.articles[1].created_at).getTime(),
        )));
      it('GET/QUERY: allows users to query with their own sort criteria and order, such as votes and ascending', () => request
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(
          ({ body }) => expect(body.articles[0].votes <= body.articles[body.articles.length - 1].votes).to.be
            .true,
        ));
      it('GET/QUERY: allows users to limit the rows displayed on a page, defaults to 10', () => request
        .get('/api/articles?limit=7')
        .expect(200)
        .then(({ body }) => expect(body.articles.length).to.equal(7)));
    });
    it('GET/QUERY: allows user to query a certain page of article results', () => request
      .get('/api/articles?p=3&limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(2);
        expect(body.articles[0].article_id).to.equal(5);
        expect(body.articles[1].article_id).to.equal(6);
      }));
  });
});
