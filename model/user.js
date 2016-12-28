var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

const saltRounds = 10;

var UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  }
);

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', function(next) {
  var now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  let user = this;
  if(!this.notEditPassword) {
    bcrypt.hash(this.password, saltRounds, function(err, hash) {
      if(err) {
        console.log(err);
      } else {
        user.password = hash;
        next();
      }
    });
  } else {
    delete this.notEditPassword;
    next();
  }
});

UserSchema.methods.comparePassword = function(pw, callback) {
  bcrypt.compare(pw, this.password, function(err, same) {
    if(err) {
      callback(err, false);
      return;
    }
    callback(null, same);
  });
};

module.exports = mongoose.model('user', UserSchema);
