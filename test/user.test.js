require('./test_helper'); //global before()

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var server;
var agent; //keep cookies and session
var User = require('../model/user');

describe('Users', function() {
    before(function(done) { // Wait for test_helper
      if(!server) {
        server = require('../server');
        agent = chai.request.agent(server);
      }
      done();
    });

  /*
  * Test the /GET route
  */
  describe('login', function() {
      before(function(done) {
        User.remove({}, function(err) {
          var user_data = {
            name: 'AAA',
            email: 'aa@bb.com',
            password: 'AAA',
            isAdmin: true
          };
          var user = new User(user_data);
          user.save(function(err, u) {
            if(err) console.log(err);
            else done();
          });
        });
    });

      it('it should login with correct password', function(done) {
        let user = {
            email: "aa@bb.com",
            password: "AAA"
        };
        agent
            .post('/api/users/login')
            .send(user)
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('user');
              res.body.user.should.have.property('name').eql('AAA');
              res.body.user.should.not.have.property('password');
              res.body.should.not.have.property('err');
              done();
            });
      });

      it('it should not login with wrong email', function(done) {
        let user = {
            email: "cc@d.com",
            password: "AAA"
        }
        chai.request(server)
            .post('/api/users/login')
            .send(user)
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('err').eql('permission denied');
              done();
            });
      });

      it('it should not login with wrong password', function(done) {
        let user = {
            email: "aa@bb.com",
            password: "aaa"
        }
        chai.request(server)
            .post('/api/users/login')
            .send(user)
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('err').eql('permission denied');
              done();
            });
      });
  });
});
