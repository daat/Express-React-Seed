var express = require('express');
var router = express.Router();

var Post = require('./../model/post');

router.route('/')
.get(function(req, res, next) {
  Post.
    find({}).
    exec(function(err, posts) {
      if(err) res.send(err);
      else res.json(posts);
    });
})
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
})
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
})
.delete(function(req, res, next) {
  Post.remove({_id : req.params.id}, function(err, result) {
    if(err) res.send(err);
    else res.json({ message: 'Post successfully deleted!', result });
  });
});

module.exports = router;
