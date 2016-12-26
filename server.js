var path = require('path');
var webpack = require('webpack');
var express = require('express');
var webpackConfig = require('./webpack.config');
var webpackDev = require('webpack-dev-middleware');
var webpackHot = require('webpack-hot-middleware');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var config = require('config');

var postRouter = require('./routes/post');
var userRouter = require('./routes/user');

var app = express();

if(config.util.getEnv('NODE_ENV') == 'development') {
  /*Webpack middleware for live reloading*/
  var compiler = webpack(webpackConfig);
  var webpackDevMiddleware = webpackDev(compiler, {
    publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
  });
  app.use(webpackDevMiddleware);
  app.use(webpackHot(compiler));
}

if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs

}

/*connect to mongodb*/
var mongodbURI = 'mongodb://' + config.mongodb.DBHost + '/' + config.mongodb.DBName;
mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI);
mongoose.connection.on('error', function(){ console.log('database connection error');});
// mongoose.connection.once('open', function() {console.log('database opened')});
/*When mockgoose is applied*/
if(mongoose.isMocked) console.log('mongoose is mocked\n\n');

/*in-memory session*/
app.use(session(config.session));

/*parse JSON request*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

/*routing*/
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

if(config.util.getEnv('NODE_ENV') == 'development') {
  app.get('*', function(req, res) {
    res.write(webpackDevMiddleware.fileSystem.readFileSync(path.join(__dirname, 'public/dist/index.html')));
    res.end();
  });
} else {
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/dist/index.html'));
  });
}


app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});

/*export for testing*/
module.exports = app;
