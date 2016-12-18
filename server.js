var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var webpackDev = require('webpack-dev-middleware');
var webpackHot = require('webpack-hot-middleware');

var app = express();
var compiler = webpack(config);

var webpackDevMiddleware = webpackDev(compiler, {
  publicPath: config.output.publicPath,
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
  // res.write(webpackDevMiddleware.fileSystem.readFileSync(path.join(__dirname, 'public/index.html')));
  // res.end();
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
})
