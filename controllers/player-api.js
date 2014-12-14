var Player = require('../models/player');

var addPlayer = function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  if(!firstName || '' === firstName || !lastName || '' === lastName) {
    var msg = 'Bad Request: First name or last name missing or empty';
    console.log(msg);
    res.status(400).send(msg).end();
  } else {
    var player = new Player({
      firstName: firstName,
      lastName: lastName
    });

    player.save(function(err) {
      if(err) {
        var msg = "Internal Server Error: Error while writing to database";
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        var msg = "New player created";
        console.log(msg);
        res.send(msg);
      }
    });
  }
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

var deletePlayer = function(req, res) {
  // TODO check for id in req ?

  Player.remove({
    _id: req.params.player_id
  }, function(err, count) {
    if(err) {
      res.send(err);
    } else {
      res.send({message: 'deleted!!'});
    }

    console.log('deleted players: %s', count);
  });
};

exports.addPlayer = addPlayer;
exports.getPlayers = getPlayers;
exports.getPlayer = getPlayer;
exports.updatePlayer = updatePlayer;
exports.deletePlayer = deletePlayer;
