require('./test_helper'); //global before()

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var server;

var Post = require('../model/post');

describe('Posts', function() {
    before(function(done) { // Wait for test_helper
      if(!server) server = require('../server');
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
        chai.request(server)
            .get('/api/posts')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});
