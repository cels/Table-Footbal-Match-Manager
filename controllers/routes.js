var express = require('express');

var viewOptions = {
  root: './public/views',
  dotfiles: 'deny'
};

module.exports = function(app) {

  var router = express.Router();

  router.use(function(req, res, next) {
    console.log("we got a request");
    next();
  });

  // add more routes here

  router.route('*')
    .get(function(req, res) {
      res.sendFile('index.html', viewOptions);
    });

  app.use('*', router);
};





