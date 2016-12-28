// node init_admin.js [name] [email] [password]

var User = require('./../model/user');

User.count({}, function(err, count) {
  if(err) {
    console.log(err);
    return;
  }
  if(count > 0) {
    console.log('the db is not empty');
    return;
  }
  
  var user_data = {
    name: process.argv[2],
    email: process.argv[3],
    password: process.argv[4],
    isAdmin: true
  };
  var user = new User(user_data);
  user.save(function(err, u) {
    if(err) console.log(err);
    console.log(u);
  });
});
