var Match = require('../models/match');

var submitScore = function(req, res) {
  var match = req.body.match;

  if(!match) {
    var msg = 'Bad Request: Match missing';
    console.log(msg);
    res.status(400).json({message: msg}).end();
  } else {
    var m = new Match(match);

    m.save(function(err) {
      var msg = "";
      if(err) {
        msg = "Internal Server Error: Error while writing to database";
        console.log(msg, err);
        res.status(500).send(err).end();
      } else {
        msg = "Added new match";
        console.log(msg);
        res.json({message: msg});
      }
    });
  }
};

var getMatches = function(req, res) {
  Match.find(function(err, matches) {
    if(err) {
      var msg = "Internal Server Error: Error while getting list of all matches";
      console.log(msg, err);
      res.status(500).send(err).end();
    } else {
      res.json(matches);
    }
  });
};

exports.getMatches = getMatches;
exports.submitScore = submitScore;

