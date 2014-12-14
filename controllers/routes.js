var express = require('express');

var viewOptions = {
  root: './public/views',
  dotfiles: 'deny'
};

var playerApi = require('./player-api');
var gameApi = require('./game-api');
//statisticsAppi

module.exports = function(app) {

  var router = express.Router();

  router.use(function(req, res, next) {
    console.log('we got a request on /api route');
    next();
  });

  // player APIs
  router.route('/player')
    .get(function(req, res) {
      playerApi.getPlayers(req, res);
    })
    .post(function(req, res) {
      playerApi.addPlayer(req, res);
    })
    .all(function(req, res) {
      console.log('not GET request on player API');
      res.json({message: 'not GET request on player API'});
    });
  router.route('/player/:player_id')
    .get(function(req, res) {
      playerApi.getPlayer(req, res);
    })
    .put(function(req, res) {
      playerApi.updatePlayer(req, res);
    })
    .delete(function(req, res) {
      playerApi.deletePlayer(req, res);
    })

  // game API

  // statistics API

  // catch unknown APIs
  router.route('/')
    .all(function(req, res) {
      console.log('we got an unknown request on /api route');
      res.json({message: 'we got an unknown request on /api route'});
    });




  // API route
  app.use('/api', router);

  // catch all other routes
  app.all('*', function(req, res) {
    console.log('we got a request on an uncaught route');
    res.json({message: 'we got a request on an uncaught route'});

    // TODO show index.html
    // res.sendFile('index.html', viewOptions);
  });
};







