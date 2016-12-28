require('./test_helper'); //global before()

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var server;
var agent; // for retaining cookies
var Post = require('../model/post');

describe('Posts', function() {
    before(function(done) { // Wait for test_helper
      if(!server) {
        server = require('../server');
        agent = chai.request.agent(server);
      }
      done();
    });

    beforeEach(function(done) { //Before each test we empty the database
        Post.remove({}, function(err) {
           done();
        });
    });
  /*
  * Test the /GET route
  */
  describe('/GET Post', function() {
      it('it should GET all the posts', function(done) {
        agent
            .get('/api/posts')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  describe('/POST Post', function() {
      it('it should not POST a post without content field', function(done) {
        let post = {
            title: "The Lord of the Rings",
            user: "J.R.R. Tolkien"
        }
        agent
            .post('/api/posts')
            .send(post)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('content');
                res.body.errors.content.should.have.property('kind').eql('required');
                done();
            });
      });

      it('it should POST a post', function(done) {
        let post = {
            title: "The Lord of the Rings",
            user: "J.R.R. Tolkien",
            content: "HaHaHa"
        }
        agent
            .post('/api/posts')
            .send(post)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Post successfully added!');
                res.body.should.have.property('post');
                res.body.post.should.have.property('content').eql('HaHaHa');
                done();
            });
      });
  });
});
