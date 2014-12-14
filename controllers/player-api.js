var Player = require('../models/player');

var addPlayer = function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  if(!firstName || '' === firstName || !lastName || '' === lastName) {
    var msg = 'Bad Request: First name or last name missing or empty';
    console.log(msg);
    res.status(400).json({message: msg}).end();
  } else {
    var player = new Player({
      firstName: firstName,
      lastName: lastName
    });

    player.save(function(err) {
      var msg = "";
      if(err) {
        msg = "Internal Server Error: Error while writing to database";
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        msg = "New player created";
        console.log(msg);
        res.json({message: msg});
      }
    });
  }
};

var getPlayers = function(req, res) {
  Player.find(function(err, players) {
    if(err) {
      var msg = "Internal Server Error: Error while getting list of all players";
      console.log(msg, err);
      res.status(500).send(err).end();
    } else {
      res.json(players);
    }
  });
};

var getPlayer = function(req, res) {
  var id = req.params.player_id;

  if(!id || "" === id) {
    var msg = 'Bad Request: ID missing or empty';
    console.log(msg);
    res.status(400).json({message: msg}).end();
  } else {
    Player.findById(id, function(err, player) {
      if(err) {
        var msg = "Internal Server Error: Error while getting player";
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        res.json(player);
      }
    });
  }
};

var updatePlayer = function(req, res) {
  var id = req.params.player_id;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  if(!id || '' === id || !firstName || '' === firstName || !lastName || '' === lastName) {
    var msg = 'Bad Request: Id, First name or last name missing or empty';
    console.log(msg);
    res.status(400).json({message: msg}).end();
  } else {
    Player.findById(id, function(err, player) {
      var msg = '';
      if(err) {
        msg = "Internal Server Error: Error while getting player";
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        player.firstName = firstName;
        player.lastName = lastName;

        player.save(function(err) {
          if(err) {
            msg = "Internal Server Error: Error while writing to database";
            console.log(msg, err);
            res.status(500).send(err).end();
          } else {
            msg = 'Player updated';
            res.json({message: msg});
          }
        });
      }
    });
  }
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
