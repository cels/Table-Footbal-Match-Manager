var Player = require('../models/player');

var addPlayer = function(req, res) {
  console.log('persisting new player');

  //TODO check for names

  var player = new Player({
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  player.save(function(err) {
    if(err) {
      console.log('ERROR!!!!', err);
      res.send(err);
    } else {
      console.log('player created');
      res.json({message: 'player created'});
    }
  });
};

var getPlayers = function(req, res) {
  console.log('returning list of all players');

  Player.find(function(err, players) {
    if(err) {
      console.log("ERROR!", err);
    } else {
      res.json(players);
    }
  });
};

var getPlayer = function(req, res) {
  // TODO check for id in req ?

  Player.findById(req.params.player_id, function(err, player) {
    if(err) {
      res.send(err);
    } else {
      res.json(player);
    }
  });
};

var updatePlayer = function(req, res) {
  // TODO check for id in req ?
  // TODO check for names in req ?

  Player.findById(req.params.player_id, function(err, player) {
    if(err) {
      res.send(err);
    } else {
      player.firstName = req.body.firstName;
      player.lastName = req.body.lastName;

      player.save(function(err) {
        if(err) {
          res.send(err);
        } else {
          res.json({message: 'player updated'});
        }
      });
    }
  });
};

// var deletePlayer = function(req, res) {

// };

exports.addPlayer = addPlayer;
exports.getPlayers = getPlayers;
exports.getPlayer = getPlayer;
exports.updatePlayer = updatePlayer;
