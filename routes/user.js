var express = require('express');
var router = express.Router();
var _ = require('underscore');

var User = require('./../model/user');

router.route('/login')
.post(function(req, res, next) {
  if(req.session.user) {
    res.json({user: req.session.user});
    return;
  }
  if(!req.body.email || !req.body.password) {
    res.json({err: 'permission denied'});
    return;
  }

  User.findOne({email: req.body.email}, function(err, user) {
    if(err) {
      console.log(err);
      res.json({err: err});
      return;
    }

    if(!user) {
      res.json({err: 'permission denied'});
      return;
    }
    user.comparePassword(req.body.password, function(err, same) {
      if(err) {
        console.log(err);
        res.json({err: err});
      }
      if(same) {
        user = _.omit(user.toObject(), 'password');
        req.session.user = user;
        res.json({user: user});
      } else {
        res.json({err: 'permission denied'});
      }
    });

  });
});

module.exports = router;
