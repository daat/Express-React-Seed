var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  next();
});

module.exports = mongoose.model('user', UserSchema);
