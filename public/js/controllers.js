'use strict';

var kickerControllers = angular.module('kickerControllers', []);

kickerControllers.controller('MainCtrl', function($scope, $http, Player) {
    $scope.submit = function(target) {
      window.location.hash = '#/' + target;
    };
  });

kickerControllers.controller('AddPlayerCtrl', function($scope, $http, Player) {
  $scope.name = null;

  $scope.disabled = false;
  $scope.formError = false;
  $scope.xhrError = false;
  $scope.pending = false;
  $scope.done = false;

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  $scope.addPlayer = function() {
    if(!$scope.name || '' === $scope.name) {
      $scope.formError = true;
    } else {
      $scope.disabled = true;
      $scope.formError = false;
      $scope.pending = true;

      Player.addPlayer($scope.name)
        .success(function(data) {
          $scope.xhrError = false;
          $scope.pending = false;
          $scope.done = true;
        })
        .error(function(data, status, headers, config) {
          $scope.xhrError = true;
          $scope.pending = false;
          $scope.done = false;
        })
        .finally(function() {
          $scope.disabled = false;
        });
    }
  };

  $scope.resetState = function() {
    $scope.disabled = false;
    $scope.formError = false;
    $scope.xhrError = false;
    $scope.pending = false;
    $scope.done = false;
  };
});

kickerControllers.controller('MatchCtrl', function($scope, $http, Player, Match) {
  $scope.allPlayers = null;
  $scope.availablePlayers = null;

  $scope.teamOne = {
    playerOne: null,
    playerTwo: null
  };
  $scope.teamTwo = {
    playerOne: null,
    playerTwo: null
  };

  $scope.goalsTeamOne = 0;
  $scope.goalsTeamTwo = 0;

  Player.getPlayers()
    .success(function(data) {
      $scope.allPlayers = data;
      $scope.availablePlayers = data;
    })
    .error(function(data, status, headers, config) {
      alert("Error while getting list of players from server\nStatus: " + status);
    });

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  $scope.submitScore = function() {
    if(!$scope.teamOne.playerOne || !$scope.teamTwo.playerOne) {
      alert("At least one player is missing!");
    } else {
      var match = {
        date: new Date(),
        teamOne: $scope.teamOne,
        teamTwo: $scope.teamTwo,
        goalsTeamOne: $scope.goalsTeamOne,
        goalsTeamTwo: $scope.goalsTeamTwo
      }

      console.log(match)

      Match.submitScore(match)
      .success(function(data) {
        alert("Successfully submitted sore!");
      })
      .error(function(data, status, headers, config) {
        alert("Error while submitting score!\nStatus: " + status);
      });
    }
  };

  $scope.switchTeams = function() {
    var temp1 = $scope.teamOne.playerOne;
    var temp2 = $scope.teamOne.playerTwo;

    $scope.teamOne.playerOne = $scope.teamTwo.playerOne;
    $scope.teamOne.playerTwo = $scope.teamTwo.playerTwo;

    $scope.teamTwo.playerOne = temp1;
    $scope.teamTwo.playerTwo = temp2;

    var tempScore = $scope.goalsTeamOne;
    $scope.goalsTeamOne = $scope.goalsTeamTwo;
    $scope.goalsTeamTwo = tempScore;
  };

  $scope.reset = function() {
    $scope.goalsTeamOne = 0;
    $scope.goalsTeamTwo = 0;
    $scope.teamOne.playerOne = null;
    $scope.teamOne.playerTwo = null;
    $scope.teamTwo.playerOne = null;
    $scope.teamTwo.playerTwo = null;
  };

  $scope.playerFilter11 = function(element) {
    if(element === $scope.teamOne.playerTwo ||
        element === $scope.teamTwo.playerOne ||
        element === $scope.teamTwo.playerTwo) {
      return false;
    }
    return true;
  };

  $scope.playerFilter12 = function(element) {
    if(element === $scope.teamOne.playerOne ||
        element === $scope.teamTwo.playerOne ||
        element === $scope.teamTwo.playerTwo) {
      return false;
    }
    return true;
  };

  $scope.playerFilter21 = function(element) {
    if(element === $scope.teamOne.playerOne ||
        element === $scope.teamOne.playerTwo ||
        element === $scope.teamTwo.playerTwo) {
      return false;
    }
    return true;
  };

  $scope.playerFilter22 = function(element) {
    if(element === $scope.teamOne.playerOne ||
        element === $scope.teamOne.playerTwo ||
        element === $scope.teamTwo.playerOne) {
      return false;
    }
    return true;
  };
});

kickerControllers.controller('MatchesCtrl', function($scope, $http, Match) {
  $scope.matches = [];

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  Match.getMatches()
    .success(function(data) {
      $scope.matches = data;
    })
    .error(function(data, status, headers, config) {
      alert("Error while getting list of matches from server\nStatus: " + status);
    });
});

kickerControllers.controller('LeaderboardsCtrl', function($scope, $http, $filter, Match) {
  $scope.matches = [];
  $scope.teamsVisible = true;
  $scope.playersVisible = false;
  $scope.statisticsVisible = false;

  $scope.teams = {};
  $scope.teamsArray = [];
  $scope.players = {};
  $scope.playersArray = [];
  $scope.statistics = {
    numOfGames: 0,
    numOfGoals: 0,
    longestKillStreakPlayer: 0,
    longestKillStreakPlayerName: [],
    longestKillStreakTeam: 0,
    longestKillStreakTeamNames: []
  };

  var orderBy = $filter('orderBy');

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  Match.getMatches()
    .success(function(data) {
      $scope.matches = data;

      analyseData();

      $scope.order('games', true);
      $scope.order('winPct', true);
      $scope.orderTeam('games', true);
      $scope.orderTeam('winPct', true);
    })
    .error(function(data, status, headers, config) {
      alert("Error while getting list of matches from server\nStatus: " + status);
    });

  $scope.showTeams = function() {
    $scope.teamsVisible = true;
    $scope.playersVisible = false;
    $scope.statisticsVisible = false;
  };

  $scope.showPlayers = function() {
    $scope.teamsVisible = false;
    $scope.playersVisible = true;
    $scope.statisticsVisible = false;
  };

  $scope.showStatistics = function() {
    $scope.teamsVisible = false;
    $scope.playersVisible = false;
    $scope.statisticsVisible = true;
  };

  $scope.order = function(predicate, reverse) {
    $scope.playersArray = orderBy($scope.playersArray, predicate, reverse);
  };

  $scope.orderTeam = function(predicate, reverse) {
    $scope.teamsArray = orderBy($scope.teamsArray, predicate, reverse);
  };

  var addPlayerData = function(player, goalsOwn, goalsEnemy) {
    if(player) {
      var n = player.name;

      if(!$scope.players.hasOwnProperty(n)) {
        $scope.players[n] = {
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
          longestKillStreak: 0
        };
      }

      $scope.players[n].games++;
      $scope.players[n].goalsOwn += goalsOwn;
      $scope.players[n].goalsEnemy += goalsEnemy;
      $scope.players[n].goalRate = $scope.players[n].goalsOwn / $scope.players[n].goalsEnemy;

      if(goalsOwn === goalsEnemy) {
        $scope.players[n].draw++;
      } else if(goalsOwn > goalsEnemy) {
        $scope.players[n].win++;
        $scope.players[n].killStreak++;

        if($scope.players[n].killStreak > $scope.players[n].longestKillStreak) {
          $scope.players[n].longestKillStreak = $scope.players[n].killStreak;

          if($scope.players[n].longestKillStreak > $scope.statistics.longestKillStreakPlayer) {
            $scope.statistics.longestKillStreakPlayer = $scope.players[n].longestKillStreak;
            $scope.statistics.longestKillStreakPlayerName = [];
            $scope.statistics.longestKillStreakPlayerName.push($scope.players[n].name);
          } else if($scope.players[n].longestKillStreak === $scope.statistics.longestKillStreakPlayer
            && -1 === $scope.statistics.longestKillStreakPlayerName.indexOf($scope.players[n])) {
            $scope.statistics.longestKillStreakPlayerName.push($scope.players[n].name);
          }
        }
      } else {
        $scope.players[n].loss++;
        $scope.players[n].killStreak = 0;
      }

      $scope.players[n].winPct = ($scope.players[n].win / $scope.players[n].games * 100);
      $scope.players[n].goalsOwnPerGame = ($scope.players[n].goalsOwn / $scope.players[n].games);
      $scope.players[n].goalsEnemyPerGame = ($scope.players[n].goalsEnemy / $scope.players[n].games);
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

    if(!$scope.teams.hasOwnProperty(n1)) {
      $scope.teams[n1] = {};
      $scope.teams[n1][n2] = {
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
        longestKillStreak: 0
      };
    } else if(!$scope.teams[n1].hasOwnProperty(n2)) {
      $scope.teams[n1][n2] = {
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
        longestKillStreak: 0
      };
    }

    $scope.teams[n1][n2].games++;
    $scope.teams[n1][n2].goalsOwn += goalsOwn;
    $scope.teams[n1][n2].goalsEnemy += goalsEnemy;
    $scope.teams[n1][n2].goalRate = $scope.teams[n1][n2].goalsOwn / $scope.teams[n1][n2].goalsEnemy;

    if(goalsOwn === goalsEnemy) {
      $scope.teams[n1][n2].draw++;
    } else if(goalsOwn > goalsEnemy) {
      $scope.teams[n1][n2].win++;
      $scope.teams[n1][n2].killStreak++;

      if($scope.teams[n1][n2].killStreak > $scope.teams[n1][n2].longestKillStreak) {
        $scope.teams[n1][n2].longestKillStreak = $scope.teams[n1][n2].killStreak;

        if($scope.teams[n1][n2].longestKillStreak > $scope.statistics.longestKillStreakTeam) {
            $scope.statistics.longestKillStreakTeam = $scope.teams[n1][n2].longestKillStreak;
            $scope.statistics.longestKillStreakTeamName = [];
            $scope.statistics.longestKillStreakTeamName.push($scope.teams[n1][n2].name1 + " + " + $scope.teams[n1][n2].name2);
          } else if($scope.teams[n1][n2].longestKillStreak === $scope.statistics.longestKillStreakTeam
            && -1 === $scope.statistics.longestKillStreakTeamName.indexOf($scope.teams[n1][n2])) {
            $scope.statistics.longestKillStreakTeamName.push($scope.teams[n1][n2].name1 + " + " + $scope.teams[n1][n2].name2);
          }
      }
    } else {
      $scope.teams[n1][n2].loss++;
      $scope.teams[n1][n2].killStreak = 0;
    }

    $scope.teams[n1][n2].winPct = ($scope.teams[n1][n2].win / $scope.teams[n1][n2].games * 100);
    $scope.teams[n1][n2].goalsOwnPerGame = ($scope.teams[n1][n2].goalsOwn / $scope.teams[n1][n2].games);
    $scope.teams[n1][n2].goalsEnemyPerGame = ($scope.teams[n1][n2].goalsEnemy / $scope.teams[n1][n2].games);
  };

  var analyseData = function() {
    for(var i = 0, ii = $scope.matches.length; i < ii; i++) {
      var teamOne = $scope.matches[i].teamOne;
      var teamTwo = $scope.matches[i].teamTwo;

      var g1 = $scope.matches[i].goalsTeamOne;
      var g2 = $scope.matches[i].goalsTeamTwo;

      var p11 = teamOne.playerOne;
      var p12 = teamOne.playerTwo;
      var p21 = teamTwo.playerOne;
      var p22 = teamTwo.playerTwo;

      $scope.statistics.numOfGames++;
      $scope.statistics.numOfGoals += (g1 + g2);

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

    for(var p in $scope.players) {
      $scope.playersArray.push($scope.players[p]);
    }

    for(var t1 in $scope.teams) {
      for(var t2 in $scope.teams[t1]) {
        $scope.teamsArray.push($scope.teams[t1][t2]);
      }
    }
  };
});
