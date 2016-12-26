var express = require('express');
var router = express.Router();

var Post = require('./../model/post');

var checkAdmin = function(req, res, next) {
  if(!!req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.json({err: 'not admin'});
  }
};

router.route('/')
.get(function(req, res, next) {
  Post.
    find({}).
    exec(function(err, posts) {
      if(err) res.send(err);
      else res.json(posts);
    });
});

router.route('/')
.post(checkAdmin)
.post(function(req, res, next) {
  var newPost = new Post(req.body);
  newPost.save(function(err, post) {
        if(err) res.send(err);
        else res.json({message: 'Post successfully added!', post });
    });
});

router.route('/:id')
.get(function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if(err) res.send(err);
    else res.json(post);
  });
});

router.route('/:id')
.put(checkAdmin)
.put(function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {
        if(err) res.send(err);
        else {
          Object.assign(post, req.body).save(function(err, post) {
            if(err) res.send(err);
            else res.json({ message: 'Post updated!', post });
          });
        }
    });
});

router.route('/:id')
.delete(checkAdmin)
.delete(function(req, res, next) {
  Post.remove({_id : req.params.id}, function(err, result) {
    if(err) res.send(err);
    else res.json({ message: 'Post successfully deleted!', result });
  });
});

module.exports = router;
