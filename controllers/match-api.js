var Match = require('../models/match');
var Statistics = require('../models/statistics');

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

        recalcStatistics();
        // TODO return?
        // var msg = "Internal Server Error: Error while recalculating statistics";
        // console.log(msg, err);
        // res.status(500).send(err).end();
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

var recalcStatistics = function() {
  var players = {};
  var playersArray = [];
  var teams = {};
  var teamsArray = [];
  var statistics = {
    numOfGames: 0,
    numOfGoals: 0,
    longestKillStreakPlayer: 0,
    longestKillStreakPlayerName: [],
    longestKillStreakTeam: 0,
    longestKillStreakTeamNames: [],
    mostWonByZero: 0,
    mostWonByZeroName: []
  };

  var addPlayerData = function(player, goalsOwn, goalsEnemy) {
    if(player) {
      var n = player.name;

      if(!players.hasOwnProperty(n)) {
        players[n] = {
          name: n,
          goalsOwn: 0,
          goalsEnemy: 0,
          games: 0,
          win: 0,
          draw: 0,
          loss: 0,
          winPct: 0,
          goalsOwnPerGame: 0,
          goalsEnemyPerGame: 0,
          goalRate: 0,
          killStreak: 0,
          longestKillStreak: 0,
          wonByZero: 0
        };
      }

      players[n].games++;
      players[n].goalsOwn += goalsOwn;
      players[n].goalsEnemy += goalsEnemy;
      players[n].goalRate = players[n].goalsOwn / players[n].goalsEnemy;

      if(goalsOwn === goalsEnemy) {
        players[n].draw++;
      } else if(goalsOwn > goalsEnemy) {
        players[n].win++;
        players[n].killStreak++;

        if(goalsEnemy === 0) {
          players[n].wonByZero++;
        }

        if(players[n].killStreak > players[n].longestKillStreak) {
          players[n].longestKillStreak = players[n].killStreak;

          if(players[n].longestKillStreak > statistics.longestKillStreakPlayer) {
            statistics.longestKillStreakPlayer = players[n].longestKillStreak;
            statistics.longestKillStreakPlayerName = [];
            statistics.longestKillStreakPlayerName.push(players[n].name);
          } else if(players[n].longestKillStreak === statistics.longestKillStreakPlayer
            && -1 === statistics.longestKillStreakPlayerName.indexOf(players[n])) {
            statistics.longestKillStreakPlayerName.push(players[n].name);
          }
        }
      } else {
        players[n].loss++;
        players[n].killStreak = 0;
      }

      players[n].winPct = (players[n].win / players[n].games * 100);
      players[n].goalsOwnPerGame = (players[n].goalsOwn / players[n].games);
      players[n].goalsEnemyPerGame = (players[n].goalsEnemy / players[n].games);
    }
  };

  var addTeamData = function(player1, player2, goalsOwn, goalsEnemy) {
    var n1 = player1.name;
    var n2 = player2.name;

    // first sort player names lexicographically in order to prevent errorneous team matching
    if(n2 > n1) {
      var tmp = n1;
      n1 = n2;
      n2 = tmp;
    }

    if(!teams.hasOwnProperty(n1)) {
      teams[n1] = {};
      teams[n1][n2] = {
        name1: n1,
        name2: n2,
        goalsOwn: 0,
        goalsEnemy: 0,
        games: 0,
        win: 0,
        draw: 0,
        loss: 0,
        winPct: 0,
        goalsOwnPerGame: 0,
        goalsEnemyPerGame: 0,
        goalRate: 0,
        killStreak: 0,
        longestKillStreak: 0,
        wonByZero: 0
      };
    } else if(!teams[n1].hasOwnProperty(n2)) {
      teams[n1][n2] = {
        name1: n1,
        name2: n2,
        goalsOwn: 0,
        goalsEnemy: 0,
        games: 0,
        win: 0,
        draw: 0,
        loss: 0,
        winPct: 0,
        goalsOwnPerGame: 0,
        goalsEnemyPerGame: 0,
        goalRate: 0,
        killStreak: 0,
        longestKillStreak: 0,
        wonByZero: 0
      };
    }

    teams[n1][n2].games++;
    teams[n1][n2].goalsOwn += goalsOwn;
    teams[n1][n2].goalsEnemy += goalsEnemy;
    teams[n1][n2].goalRate = teams[n1][n2].goalsOwn / teams[n1][n2].goalsEnemy;

    if(goalsOwn === goalsEnemy) {
      teams[n1][n2].draw++;
    } else if(goalsOwn > goalsEnemy) {
      teams[n1][n2].win++;
      teams[n1][n2].killStreak++;

      if(goalsEnemy === 0) {
        teams[n1][n2].wonByZero++;

        if(teams[n1][n2].wonByZero > statistics.mostWonByZero) {
          statistics.mostWonByZero = teams[n1][n2].wonByZero;
          statistics.mostWonByZeroName = [];
          statistics.mostWonByZeroName.push(teams[n1][n2].name1 + " + " + teams[n1][n2].name2);
        } else if(teams[n1][n2].wonByZero === statistics.mostWonByZero
          && -1 === statistics.mostWonByZeroName.indexOf(teams[n1][n2])) {
          statistics.mostWonByZeroName.push(teams[n1][n2].name1 + " + " + teams[n1][n2].name2);
        }
      }

      if(teams[n1][n2].killStreak > teams[n1][n2].longestKillStreak) {
        teams[n1][n2].longestKillStreak = teams[n1][n2].killStreak;

        if(teams[n1][n2].longestKillStreak > statistics.longestKillStreakTeam) {
          statistics.longestKillStreakTeam = teams[n1][n2].longestKillStreak;
          statistics.longestKillStreakTeamNames = [];
          statistics.longestKillStreakTeamNames.push(teams[n1][n2].name1 + " + " + teams[n1][n2].name2);
        } else if(teams[n1][n2].longestKillStreak === statistics.longestKillStreakTeam
          && -1 === statistics.longestKillStreakTeamNames.indexOf(teams[n1][n2])) {
          statistics.longestKillStreakTeamNames.push(teams[n1][n2].name1 + " + " + teams[n1][n2].name2);
        }
      }
    } else {
      teams[n1][n2].loss++;
      teams[n1][n2].killStreak = 0;
    }

    teams[n1][n2].winPct = (teams[n1][n2].win / teams[n1][n2].games * 100);
    teams[n1][n2].goalsOwnPerGame = (teams[n1][n2].goalsOwn / teams[n1][n2].games);
    teams[n1][n2].goalsEnemyPerGame = (teams[n1][n2].goalsEnemy / teams[n1][n2].games);
  };

  Match.find(function(err, matches) {
    if(err) {
      return false;
    } else {
      for(var i = 0, ii = matches.length; i < ii; i++) {
        var teamOne = matches[i].teamOne;
        var teamTwo = matches[i].teamTwo;

        var g1 = matches[i].goalsTeamOne;
        var g2 = matches[i].goalsTeamTwo;

        var p11 = teamOne.playerOne;
        var p12 = teamOne.playerTwo;
        var p21 = teamTwo.playerOne;
        var p22 = teamTwo.playerTwo;

        statistics.numOfGames++;
        statistics.numOfGoals += (g1 + g2);

        addPlayerData(p11, g1, g2);
        addPlayerData(p12, g1, g2);
        addPlayerData(p21, g2, g1);
        addPlayerData(p22, g2, g1);

        if(p11 && p12) {
          addTeamData(p11, p12, g1, g2);
        }

        if(p21 && p22) {
          addTeamData(p21, p22, g2, g1);
        }
      }

      for(var p in players) {
        playersArray.push(players[p]);
      }

      for(var t1 in teams) {
        for(var t2 in teams[t1]) {
          teamsArray.push(teams[t1][t2]);
        }
      }

      console.log(statistics)

      return true;
    }
  });
};

exports.getMatches = getMatches;
exports.submitScore = submitScore;

