var Player = require('../models/player');

var addPlayer = function(req, res) {
  console.log('persisting new player');

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



exports.addPlayer = addPlayer;
