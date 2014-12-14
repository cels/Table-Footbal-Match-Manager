var Team = require('../models/team');

var getTeams = function(req, res) {
  Team.find(function(err, teams) {
    if(err) {
      var msg = "Internal Server Error: Error while getting list of all teams";
      console.log(msg, err);
      res.status(500).send(err).end();
    } else {
      res.json(teams);
    }
  });
};

var addTeam = function(req, res) {
  var playerOneId = req.body.playerOneId;
  var playerTwoId = req.body.playerTwoId;

  if(!playerOneId || '' === playerOneId || !playerTwoId || '' === playerTwoId) {
    var msg = 'Bad Request';
    console.log(msg);
    res.status(400).json({message: msg}).end();
  } else {
    var team = new Team({
      playerIds: [playerOneId, playerTwoId]
    });

    team.save(function(err) {
      var msg = '';
      if(err) {
        msg = 'Internal Server Error';
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        msg = 'New team created';
        console.log(msg);
        res.json({message: msg});
      }
    });
  }
};

exports.getTeams = getTeams;
exports.addTeam = addTeam;
