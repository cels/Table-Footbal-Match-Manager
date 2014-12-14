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

var getTeam = function(req, res) {
  var id = req.params.team_id;

  if(!id || '' === id) {
    var msg = 'Bad Request: ID missing or empty';
    console.log(msg);
    res.status(400).json({message: msg}).end();
  } else {
    Team.findById(id, function(err, team) {
      if(err) {
        var msg = "Internal Server Error: Error while getting team";
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        res.json(team);
      }
    });
  }
};

exports.addTeam = addTeam;
exports.getTeams = getTeams;
exports.getTeam = getTeam;
