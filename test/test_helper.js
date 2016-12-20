process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var config = require('config');

before(function(done) {
  var mongodbURI = 'mongodb://' + config.mongodb.DBHost + '/' + config.mongodb.DBName;
  mockgoose(mongoose).then(function() {
    var server = require('../server');
    done();
  });
});
