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
    describe('ERROR TESTING', () => {
      it('responds with a 404 if endpoint is incorrect or does not exist regardless of method', () => request
        .get('/sdsdsdsd')
        .expect(404)
        .then(({ body }) => expect(body.msg).to.equal('ERROR_404_PAGE_NOT_FOUND'))
        .then(() => request
          .patch('/api/articlesf')
          .expect(404)
          .then(({ body }) => expect(body.msg).to.equal('ERROR_404_PAGE_NOT_FOUND')))
        .then(() => request
          .delete('/api/topdf')
          .expect(404)
          .then(({ body }) => expect(body.msg).to.equal('ERROR_404_PAGE_NOT_FOUND'))));
      it('POST/DELETE/PATCH/PUT: returns 405 if an invalid method is selected', () => request
        .post('/api')
        .expect(405)
        .then(({ body }) => expect(body.ERROR).to.equal('INVALID METHOD USED ON REQUEST')));
    });
    it('GET request: responds with status 200', () => request.get('/api').expect(200));
    it('GET request: returns an object containing all the endpoints and descriptions of endpoints', () => request.get('/api').then(({ body }) => {
      expect(body).to.be.a('object');
      expect(body).have.keys('/api', '/topics', '/users');
    }));
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
            expect(body.addedTopic).have.keys('slug', 'description');
          })
          .then(() => request.get('/api/topics').then(({ body }) => expect(body.topics).to.have.length(3)));
      });
      describe('ERROR TESTING', () => {
        it('POST: returns 400 if data fields are null', () => {
          const newTopic = { slug: 'test' };
          return request
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
            .then(({ body }) => expect(body.ERROR).to.equal(
              'BAD REQUEST: INVALID INPUT, FAILING NOT-NULL CONSTRAINT',
            ));
        });
        it('POST: returns 422 if topic primary key (slug) is already in use', () => {
          const newTopic = { slug: 'mitch', description: 'this is a test' };
          return request
            .post('/api/topics')
            .send(newTopic)
            .expect(422)
            .then(({ body }) => expect(body.ERROR).to.equal('UNPROCESSABLE ENTITY: DATA ALREADY IN USE'));
        });
        it('DELETE/PATCH/PUT: returns 405 if an invalid method is selected', () => request
          .patch('/api/topics')
          .expect(405)
          .then(({ body }) => expect(body.ERROR).to.equal('INVALID METHOD USED ON REQUEST')));
      });
    });
    describe('/articles', () => {
      it('GET request: responds with a 200 status', () => request.get('/api/articles').expect(200));
      it('GET request: returns an array of article object with the main keys', () => request.get('/api/articles').then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.keys(
          'author',
          'title',
          'article_id',
          'topic',
          'created_at',
          'votes',
          'comment_count',
        );
      }));
      it('GET request: must also have a numOfArticles that displays correct number of articles displayed', () => request
        .get('/api/articles')
        .then(({ body }) => {
          expect(+body.numOfArticles).to.equal(12);
        })
        .then(() => request
          .get('/api/articles?limit=3')
          .then(({ body }) => expect(+body.numOfArticles).to.equal(12))));
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
      it('GET/QUERY: allows user to query a certain page of article results', () => request
        .get('/api/articles?p=3&limit=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(2);
          expect(body.articles[0].article_id).to.equal(5);
          expect(body.articles[1].article_id).to.equal(6);
        }));
    });
    describe('/articles/:article_id', () => {
      it('GET request: returns a status 200', () => request.get('/api/articles/3').expect(200));
      it('GET request: returns an object with the given article id parameter and object contains all correct values', () => request
        .get('/api/articles/2')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.a('object');
          expect(body.article.article_id).to.equal(2);
          expect(body.article).contain.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'author',
            'created_at',
          );
        }));
      it('GET request: returned object also has a comment_count key with correct value', () => request
        .get('/api/articles/5')
        .expect(200)
        .then(({ body }) => {
          expect(body.article).contain.keys('comment_count');
          expect(+body.article.comment_count).to.equal(2);
        }));
      it('PATCH request: responds with 200 allows updating of votes value in articles object, returns the updated article', () => request
        .patch('/api/articles/1')
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle.votes).to.equal(110);
          expect(body.updatedArticle).contain.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'author',
            'created_at',
          );
        }));
      it('DELETE request: responds with a 204 status code', () => request.delete('/api/articles/2').expect(204));
      it('DELETE request: removes/deletes articles with the given article ID parameter', () => request
        .delete('/api/articles/1')
        .expect(204)
        .then(() => request.get('/api/articles/'))
        .then(({ body }) => expect(body.articles.find(article => article.article_id === 1)).to.equal(undefined)));
      describe('ERROR TESTING', () => {
        it('GET: returns 404 when articles id does not exist', () => request
          .get('/api/articles/200')
          .expect(404)
          .then(({ body }) => {
            expect(body.ERROR).to.equal('ERROR: Article Does Not Exist');
          }));
        it('DELETE: returns 404 when articles id does not exist', () => request
          .delete('/api/articles/200')
          .expect(404)
          .then(({ body }) => expect(body.ERROR).to.equal('ERROR: Article Does Not Exist Or May Have Been Removed')));
        it('PATCH: returns 404 when articles id does not exist', () => request
          .patch('/api/articles/200')
          .send({ inc_votes: 20 })
          .expect(404)
          .then(({ body }) => expect(body.ERROR).to.equal('ERROR: Article Does Not Exist')));
        it('PATCH: returns 400 if patch input data is incorrect type', () => request
          .patch('/api/articles/3')
          .send({ inc_votes: 'geeeeee' })
          .expect(400)
          .then(({ body }) => expect(body.ERROR).to.equal('ERROR: INVALID DATA INPUT')));
        it('POST: returns 400 if posted data is not correct type', () => {
          const newArticle = {
            title: 123456,
            body: 'blahblah, blah blah bllllllllllllllllllaaaaaaaahhhh',
            votes: 'dfgh',
            topic: 'mitch',
            author: 'butter_bridge',
          };
          return request
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({ body }) => expect(body.ERROR).to.equal('BAD REQUEST: INVALID INPUT SYNTAX'));
        });
        it('POST: returns 422 if posted data is correct but foreign key relation does not exist', () => {
          const newArticle = {
            title: 'Sheep',
            body: 'blahblah, blah blah bllllllllllllllllllaaaaaaaahhhh',
            votes: 0,
            topic: 'mitch',
            author: 'Greg',
          };
          return request
            .post('/api/articles')
            .send(newArticle)
            .expect(422)
            .then(({ body }) => expect(body.ERROR).to.equal('UNPROCESSABLE ENTITY: PLEASE REVIEW DATA'));
        });
        it('POST: returns 405 if an invalid method is selected', () => request
          .post('/api/articles/2')
          .expect(405)
          .then(({ body }) => expect(body.ERROR).to.equal('INVALID METHOD USED ON REQUEST')));
      });
    });
    describe('/articles/:article_id/comments', () => {
      it('GET request: responds with a status 200', () => request.get('/api/articles/1/comments').expect(200));
      it('GET request: returns an array of comments from given article ID and contains correct keys', () => request.get('/api/articles/1/comments').then(({ body }) => {
        expect(body.articleComments[0]).contain.keys(
          'comment_id',
          'votes',
          'created_at',
          'author',
          'body',
        );
      }));
      it('GET/QUERY: sort by and ordering of results defaults to date and descending', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(
          ({ body }) => expect(
            new Date(body.articleComments[0].created_at).getTime()
                  > new Date(body.articleComments[3].created_at).getTime(),
          ).to.be.true,
        ));
      it('GET/QUERY: allows user to set Limit of rows displayed on a page which defaults to 10', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => expect(body.articleComments).to.have.length(10))
        .then(() => request.get('/api/articles/1/comments?limit=4'))
        .then(({ body }) => expect(body.articleComments).to.have.length(4)));
      it('GET/QUERY: allows user to query a certain page of article results', () => request
        .get('/api/articles/1/comments?limit=3&p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articleComments[0].comment_id).to.equal(5);
          expect(body.articleComments[1].comment_id).to.equal(6);
          expect(body.articleComments[2].comment_id).to.equal(7);
          expect(body.articleComments).to.have.length(3);
        }));
      it('POST request: responds with a 201 status and returns the posted comment with correct keys', () => {
        const newComment = {
          username: 'butter_bridge',
          body: 'This is testing that the post works',
        };
        return request
          .post('/api/articles/4/comments')
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body.postedComment).contain.keys(
              'author',
              'comment_id',
              'votes',
              'body',
              'created_at',
            );
          });
      });
      describe('ERROR TESTING', () => {
        it('GET: returns 404 when articles id does not exist', () => request
          .get('/api/articles/1111/comments')
          .expect(404)
          .then(({ body }) => expect(body.ERROR).to.equal('ERROR: Article Does Not Exist')));
        it('POST: returns 404 when articles id does not exist', () => request
          .get('/api/articles/1111/comments')
          .expect(404)
          .then(({ body }) => expect(body.ERROR).to.equal('ERROR: Article Does Not Exist')));
        it('POST: returs 400 when articles id exists but input data is empty', () => {
          const newComment = {
            username: 'butter_bridge',
            body: '',
          };
          return request
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => expect(body.ERROR).to.equal('ERROR: COMMENT CANNOT BE EMPTY'));
        });
        it('POST: returns 422 when relational foreign key is in the correct form but not present in db', () => {
          const newComment = {
            username: 'butter_br',
            body: 'testinnnnggg',
          };
          return request
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(422)
            .then(({ body }) => expect(body.ERROR).to.equal('UNPROCESSABLE ENTITY: PLEASE REVIEW DATA'));
        });
        it('POST/PUT: returns 405 if an invalid method is selected', () => request
          .post('/api/articles/2')
          .expect(405)
          .then(({ body }) => expect(body.ERROR).to.equal('INVALID METHOD USED ON REQUEST')));
      });
    });
    describe('/comments/:comment_id', () => {
      it('PATCH request: responds with 200 status and the updated comment', () => {
        const incVotes = { inc_votes: 12 };
        return request
          .patch('/api/comments/2')
          .send(incVotes)
          .expect(200)
          .then(({ body }) => {
            expect(body.updatedComment).contain.keys(
              'comment_id',
              'author',
              'article_id',
              'comment_id',
              'votes',
              'created_at',
              'body',
            );
            expect(body.updatedComment.votes).to.equal(26);
          });
      });
      it('DELETE request: responds with 204 and removes comment from database', () => request
        .get('/api/articles/1/comments?limit=15')
        .then(({ body }) => expect(body.articleComments).to.have.length(13))
        .then(() => request.delete('/api/comments/5').expect(204))
        .then(() => request.get('/api/articles/1/comments?limit=15').expect(200))
        .then(({ body }) => expect(body.articleComments).to.have.length(12)));
      describe('ERROR TESTING', () => {
        it('PATCH: responds with 400 if passed a comment id that does not exist', () => {
          const incVotes = { inc_votes: 12 };
          return request
            .patch('/api/comments/9000')
            .send(incVotes)
            .expect(404)
            .then(({ body }) => expect(body.ERROR).to.equal('ERROR: Comment Does Not Exist'));
        });
        it('PATCH: responds with 400 if passed a comment that is not in correct format ', () => {
          const incVotes = { inc_votes: 'dfgh' };
          return request
            .patch('/api/comments/3')
            .send(incVotes)
            .expect(400)
            .then(({ body }) => expect(body.ERROR).to.equal('ERROR: INVALID DATA INPUT'));
        });
        it('DELETE: responds with 400 if comment does not exist ', () => request
          .delete('/api/comments/9000')
          .expect(404)
          .then(({ body }) => expect(body.ERROR).to.equal('ERROR: Comment Does Not Exist Or May Have Been Removed')));
        it('POST/PUT/GET: returns 405 if an invalid method is selected', () => request
          .get('/api/comments/7')
          .expect(405)
          .then(({ body }) => expect(body.ERROR).to.equal('INVALID METHOD USED ON REQUEST')));
      });
    });
    describe('/users', () => {
      it('GET request: responds with a 200 status', () => request.get('/api/users').expect(200));
      it('GET request: returns an array of user objects with correct keys', () => request.get('/api/users').then(({ body }) => {
        expect(body.users[0]).have.keys('username', 'avatar_url', 'name');
        expect(body.users).have.length(3);
      }));
      it('POST request: responds with a 201 status and returns the posted user with all correct keys', () => {
        const newUser = { username: 'user5555', avatar_url: 'www.test.com/jpg', name: 'Mark' };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .then(({ body }) => {
            expect(body.addedUser.name).to.equal('Mark');
            expect(body.addedUser).have.keys('username', 'avatar_url', 'name');
          });
      });
      describe('/users/:username', () => {
        it('GET request: responds with a 200 status code', () => request.get('/api/users/rogersop').expect(200));
        it('GET request: responds with a user object containing all correct keys', () => request
          .get('/api/users/icellusedkars')
          .then(({ body }) => expect(body.user).have.keys('username', 'avatar_url', 'name')));
        describe('ERROR TESTING', () => {
          it('GET: returns 404 when username is given as a paramter that does not exist', () => request
            .get('/api/users/bob')
            .expect(404)
            .then(({ body }) => expect(body.ERROR).to.equal('ERROR: User Does Not Exist')));
          it('POST: responds with 422 if user is added and username already exists', () => {
            const newUser = { username: 'rogersop', avatar_url: 'www.test.com/jpg', name: 'Mark' };
            return request
              .post('/api/users')
              .send(newUser)
              .expect(422);
          });
          it('DELETE/PATCH/PUT: returns 405 if an invalid method is selected', () => request
            .delete('/api/users')
            .expect(405)
            .then(({ body }) => expect(body.ERROR).to.equal('INVALID METHOD USED ON REQUEST')));
        });
      });
    });
  });
});
