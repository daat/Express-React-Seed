var express = require('express');
var router = express.Router();

var User = require('./../model/user');

router.route('/login')
.post(function(req, res, next) {
  /*TBD*/
  res.json({user: {name: 'aa', email: 'aa@d.com', isAdmin: true}});
});

module.exports = router;
